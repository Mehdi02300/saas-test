import Cookies from "js-cookie";

async function verifyToken(token) {
  try {
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

    return response.ok;
  } catch {
    return false;
  }
}

function getSession() {
  return Cookies.get("session");
}

function setSession(token) {
  const FIVE_DAYS = 60 * 60 * 24 * 5;

  Cookies.set("session", token, {
    expires: FIVE_DAYS,
    secure: process.env.NODE_ENV === "production",
  });
}

export { verifyToken, getSession, setSession };
