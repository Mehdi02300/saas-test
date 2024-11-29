"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Link from "next/link";

const FormSignUp = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const errorMessages = {
    "auth/email-already-in-use": "Cet email est déjà utilisé",
    "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères",
    "auth/invalid-email": "Email invalide",
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      setError(errorMessages[err.code] || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSignup}
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

        <h2 className="h2 text-center">Inscription</h2>

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
            {isLoading ? "Inscription..." : "S'inscrire"}
          </button>
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 border-b border-b-n-8"></div>
            <div className="text-center">ou</div>
            <div className="flex-1 border-b border-b-n-8"></div>
          </div>
          <Link href="/login">
            <button className="w-full px-5 py-3 lg:mt-8 text-white bg-n-9 rounded-xl hover:bg-n-7 animate">
              Se connecter
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FormSignUp;
