import Cookies from "js-cookie";

export async function verifyToken(token) {
  try {
    console.log("Vérification du token...");
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

    const data = await response.json();
    console.log("Réponse de vérification:", data);

    return response.ok;
  } catch (error) {
    console.error("Erreur de vérification:", error);
    return false;
  }
}

export function getSession() {
  const session = Cookies.get("session");
  console.log("Session récupérée:", session);
  return session;
}

export function setSession(token) {
  console.log("Définition de la session avec le token:", token);
  const expiresIn = 60 * 60 * 24 * 5; // 5 jours

  Cookies.set("session", token, {
    expires: expiresIn,
    secure: process.env.NODE_ENV === "production",
  });
}
