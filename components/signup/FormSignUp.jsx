import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

const FormSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSignup}
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
        <h2 className="mb-4 text-2xl font-bold text-center">Inscription</h2>
        {error && <p className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded">{error}</p>}
        <div className="lg:space-y-10">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-md">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border rounded shadow-sm"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-md">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border rounded shadow-sm"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-3 text-white bg-n-9 rounded hover:bg-n-7 animate"
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormSignUp;
