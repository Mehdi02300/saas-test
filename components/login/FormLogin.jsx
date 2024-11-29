"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/actions/auth.action";
import Link from "next/link";

const FormLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const errorMessages = {
    "auth/invalid-credential": "Email ou mot de passe incorrect",
    "auth/too-many-requests": "Trop de tentatives, veuillez réessayer plus tard",
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const token = await userCredential.user.getIdToken();
      const result = await handleLogin(token);

      if (result.success) {
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 100);
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError(errorMessages[err.code] || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={onSubmit}
        className="relative p-6 lg:p-12 bg-n-6 rounded shadow-lg lg:rounded-xl w-80 lg:w-[500px]"
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

        <div className="lg:space-y-8">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-md">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-5 py-3 border rounded shadow-sm"
              placeholder="Entrez votre mot de passe"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-5 py-3 text-white bg-n-9 rounded-xl hover:bg-n-7 animate disabled:opacity-50"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 border-b border-b-n-8"></div>
            <div className="text-center">ou</div>
            <div className="flex-1 border-b border-b-n-8"></div>
          </div>
          <Link href="/signup">
            <button className="w-full px-5 py-3 lg:mt-8 text-white bg-n-9 rounded-xl hover:bg-n-7 animate">
              S'inscrire
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FormLogin;
