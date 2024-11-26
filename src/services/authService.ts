// todo: fix
// todo: get expired towork
// todo: go to log in screen if not logged in
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

// src/services/authService.ts
const COGNITO_AWS_REGION = process.env.REACT_APP_COGNITO_AWS_REGION || '';
const COGNITO_CLIENT_ID = process.env.REACT_APP_COGNITO_CLIENT_ID || '';
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || '';

// Dynamically compute the Cognito domain
const COGNITO_DOMAIN = `peopledepot.auth.${COGNITO_AWS_REGION}.amazoncognito.com`;

// Compute dependent URLs
const TOKEN_ENDPOINT = `https://${COGNITO_DOMAIN}/oauth2/token`;
const LOGIN_URL = `https://${COGNITO_DOMAIN}/login?response_type=code&client_id=${COGNITO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid`;

console.log('TOKEN_ENDPOINT:', TOKEN_ENDPOINT);
console.log('LOGIN_URL:', LOGIN_URL);
export const redirectToLogin = () => {
  window.location.href = LOGIN_URL;
};

export function isTokenExpired(token: string) {
  const { exp } = jwtDecode(token);
  const now = Date.now() / 1000; // Current time in seconds
  console.log("expired?", now, exp)
  return exp || 0 < now;
}


const refreshTokenFunc = async () => {
  // todo: fix
  const refreshToken = localStorage.getItem("refresh_token") || '';
  try {
    console.log("token_endpoint", TOKEN_ENDPOINT, refreshToken)
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

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token)
    return data.access_token; // Return the new access token
  } catch (error) {
        if (error instanceof Error) {
          console.error("Error refreshing token:", error.message);
        } else {
          console.error("Unknown error refreshing token:", error);
    }
  }
}

export const makeGetRequest = async (url: string) => {
  let token = localStorage.getItem("access_token") || "";

  if (isTokenExpired(token)) {
    // Token is expired, try to refresh
    token = await refreshTokenFunc();
  }
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  };
};



export const exchangeCodeForToken = async (code: string): Promise<void> => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: COGNITO_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
  });

  try {
    console.log("Endpoiont", TOKEN_ENDPOINT)
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      
      body: params.toString(),
    });
    console.log("Fetched")

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

    const data = await response.json();
    console.log("Full token response:", data); // Check if it contains access_token, id_token, etc.
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token)
    window.location.href = "/"; // Redirect to projects after successful login
  } catch (error) {
    console.error("Token exchange error:", error);
    throw error;
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};
