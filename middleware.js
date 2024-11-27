import { NextResponse } from "next/server";

export async function middleware(request) {
  // Vérifier le cookie de session
  const session = request.cookies.get("session")?.value;

  if (!session) {
    console.log("Pas de session trouvée");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Vérifier la validité du token
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: session }),
      }
    );

    if (!response.ok) {
      console.log("Token invalide");
      // Créer une réponse de redirection
      const response = NextResponse.redirect(new URL("/login", request.url));
      // Supprimer le cookie
      response.cookies.delete("session");
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Erreur de vérification:", error);
    // Créer une réponse de redirection
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Supprimer le cookie
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
