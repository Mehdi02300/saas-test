"use server";

import { cookies } from "next/headers";

export async function handleLogin(token) {
  if (!token) {
    return { error: "Token manquant" };
  }

  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 jours

    // Vérifier le token
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.error("Erreur Firebase:", data);
      return { error: "Authentification échouée" };
    }

    // Définir le cookie avec une option sécurisée
    cookies().set("session", token, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return { error: "Une erreur est survenue lors de la connexion" };
  }
}

export async function getSession() {
  return cookies().get("session")?.value;
}

// Fonction pour supprimer la session
export async function clearSession() {
  cookies().delete("session");
}

export async function handleLogout() {
  // Supprime le cookie de session
  cookies().delete("session");

  return { success: true };
}
