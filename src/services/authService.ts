// todo: fix
// todo: get expired towork
// todo: go to log in screen if not logged in
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

// src/services/authService.ts
const COGNITO_AWS_REGION = "us-east-2";
const COGNITO_DOMAIN = `peopledepot.auth.${COGNITO_AWS_REGION}.amazoncognito.com`;

// const COGNITO_USER_POOL_NAME="peopledepot"
// const COGNITO_USER_POOL="us-east-2_i2EKGBFG1"
const COGNITO_CLIENT_ID = "35ehknpgi8ul8nfn2undd6ufro";
const REDIRECT_URI = "http://localhost:3000/callback/";
const TOKEN_ENDPOINT = `https://${COGNITO_DOMAIN}/oauth2/token`;
const LOGIN_URL = `https://${COGNITO_DOMAIN}/login?response_type=code&client_id=${COGNITO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid`;

export const redirectToLogin = () => {
  window.location.href = LOGIN_URL;
};

export function isTokenExpired(token: string) {
  const { exp } = jwtDecode(token);
  const now = Date.now() / 1000; // Current time in seconds
  console.log("expired?", now, exp)
  return exp || 0 < now;
}


const refreshTokenFunc = async (refreshToken: string) => {
  // todo: fix
  return refreshToken;
  // try {
  //   const response = await fetch("https://peopledepot-cognito-domain/oauth2/token", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({
  //       grant_type: "refresh_token",
  //       client_id: "35ehknpgi8ul8nfn2undd6ufro",
  //       refresh_token: refreshToken,
  //     }).toString(),
  //   });

  //   if (!response.ok) {
  //     throw new Error("Failed to refresh token");
  //   }

  //   const data = await response.json();
  //   return data.access_token; // Return the new access token
  // } catch (error) {
  //       if (error instanceof Error) {
  //         console.error("Error refreshing token:", error.message);
  //       } else {
  //         console.error("Unknown error refreshing token:", error);
  //   }
  // }
}

export const makeGetRequest = async (url: string) => {
  let token = localStorage.getItem("access_token") || "";

  if (isTokenExpired(token)) {
    // Token is expired, try to refresh
    token = await refreshTokenFunc(token);
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

    const data = await response.json();
    console.log("Full token response:", data); // Check if it contains access_token, id_token, etc.
    localStorage.setItem("access_token", data.access_token);
    window.location.href = "/"; // Redirect to projects after successful login
  } catch (error) {
    console.error("Token exchange error:", error);
    throw error;
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};
