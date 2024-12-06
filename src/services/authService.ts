// todo: fix
// todo: get expired towork
// todo: go to log in screen if not logged in
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

// src/services/authService.ts
const COGNITO_AWS_REGION = process.env.REACT_APP_COGNITO_AWS_REGION || '';
const COGNITO_CLIENT_ID = process.env.REACT_APP_COGNITO_CLIENT_ID || '';
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || "";
const API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL || "";

// Dynamically compute the Cognito domain
const COGNITO_DOMAIN = `peopledepot.auth.${COGNITO_AWS_REGION}.amazoncognito.com`;

// Compute dependent URLs
const TOKEN_ENDPOINT = `https://${COGNITO_DOMAIN}/oauth2/token`;

const LOGIN_URL = COGNITO_CLIENT_ID ? 
  `https://${COGNITO_DOMAIN}/login?response_type=code&client_id=${COGNITO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid` :
  "login/"

export const redirectToLogin = () => {
  window.location.href = LOGIN_URL;
};

export function isTokenExpired(token: string) {
  if (!COGNITO_CLIENT_ID) {
    return false
  }

  const { exp } = jwtDecode(token);
  const now = Date.now() / 1000; // Current time in seconds
  return (exp || now) < now;
}

export const setTokens = async (response: any) => {
  const data = await response.json();

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return { accessToken: data.access_token, refreshToken: data.refresh_token }
};

const refreshTokenFunc = async () => {
  const refreshToken = localStorage.getItem("refresh_token") || '';
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: "35ehknpgi8ul8nfn2undd6ufro",
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const tokens: any = await setTokens(response)
    const newRefreshToken = tokens.refresh_token;
    const accessToken = tokens.access_token;

    return { accessToken, refreshToken: newRefreshToken }; // Return the new access token
  } catch (error) {
        if (error instanceof Error) {
          console.error("Error refreshing token:", error.message);
        } else {
          console.error("Unknown error refreshing token:", error);
    }
  }
}


export const makeGetRequest = async (url: string) => {
  let accessToken = localStorage.getItem("access_token") || "";
  if (isTokenExpired(accessToken)) {
    // Token is expired, try to refresh
    const tokens = await refreshTokenFunc();
    accessToken = tokens?.accessToken
  }
  try {
    const response = await axios.get(API_SERVER_URL+url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  };
};

export const makePatchRequest = async (url: string, data: any) => {
  let accessToken = localStorage.getItem("access_token") || "";
  if (isTokenExpired(accessToken)) {
    // Token is expired, try to refresh
    const tokens = await refreshTokenFunc();
    accessToken = tokens?.accessToken
  }  
  const response = await fetch(API_SERVER_URL+url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};




export const exchangeCodeForToken = async (code: string): Promise<void> => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: COGNITO_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
  });

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Token exchange failed:", errorData);
      const { error, error_description, error_uri, state, scope } = errorData;
      console.error("Error code:", error);
      console.error(
        "Error description:",
        error_description,
        "x",
        state,
        "x",
        scope
      );
      if (error_uri) {
        console.error("Error URI:", error_uri);
      }
      throw new Error("Failed to exchange code for token");
    }

    await setTokens(response);
    window.location.href = "/"; // Redirect to home page
  } catch (error) {
    console.error("Token exchange error:", error);
    throw error;
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};
