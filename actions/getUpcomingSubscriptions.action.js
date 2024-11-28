"use server";

import { cookies } from "next/headers";

export async function getUpcomingSubscriptions() {
  try {
    const session = cookies().get("session")?.value;
    if (!session) return [];

    // Verify Firebase token
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: session }),
      }
    );

    if (!response.ok) return [];

    const {
      users: [{ localId: userId }],
    } = await response.json();
    return { userId };
  } catch {
    return [];
  }
}
