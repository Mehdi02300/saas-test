"use server";

import { cookies } from "next/headers";

// Constants
const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export async function handleLogin(token) {
  if (!token) return { error: "Token manquant" };

  try {
    // Verify token with Firebase
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!response.ok) return { error: "Authentification échouée" };

    // Set session cookie
    cookies().set("session", token, {
      ...COOKIE_OPTIONS,
      maxAge: SESSION_DURATION,
    });

    return { success: true };
  } catch (error) {
    return { error: "Une erreur est survenue lors de la connexion" };
  }
}

export async function handleLogout() {
  cookies().delete("session");
  return { success: true };
}

export async function getSession() {
  return cookies().get("session")?.value;
}

export async function clearSession() {
  cookies().delete("session");
}
