import { NextResponse } from "next/server";

export async function middleware(request) {
  const session = request.cookies.get("session")?.value;

  if (!session) {
    return createRedirectResponse(request.url);
  }

  try {
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
      return createRedirectResponse(request.url, true);
    }

    return NextResponse.next();
  } catch {
    return createRedirectResponse(request.url, true);
  }
}

// Helper function to create redirect response
function createRedirectResponse(requestUrl, deleteCookie = false) {
  const response = NextResponse.redirect(new URL("/login", requestUrl));
  if (deleteCookie) {
    response.cookies.delete("session");
  }
  return response;
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
