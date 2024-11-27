"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/actions/auth.action";

const FormLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Authentification Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase auth success");

      // Obtention du token
      const token = await userCredential.user.getIdToken();
      console.log("Token obtained");

      // Création de la session
      const result = await handleLogin(token);
      console.log("Login result:", result);

      if (result.success) {
        // Redirection avec un petit délai pour laisser le temps au cookie de s'établir
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 100);
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential") {
        setError("Email ou mot de passe incorrect");
      } else if (err.code === "auth/too-many-requests") {
        setError("Trop de tentatives, veuillez réessayer plus tard");
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={onSubmit}
        className="relative p-6 lg:p-12 bg-n-6 rounded shadow-lg lg:rounded-xl w-80 lg:h-[450px] lg:w-[500px]"
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute text-lg top-4 left-4 flex items-center text-n-9 hover:text-n-7"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7 mr-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <h2 className="h2 text-center">Connexion</h2>
        {error && <p className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded">{error}</p>}
        <div className="lg:space-y-10">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-md">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border rounded shadow-sm"
              placeholder="Entrez votre email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-md">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border rounded shadow-sm"
              placeholder="Entrez votre mot de passe"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-5 py-3 text-white bg-n-9 rounded hover:bg-n-7 animate disabled:opacity-50"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormLogin;
