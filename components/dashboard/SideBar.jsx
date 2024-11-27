"use client";

import { Bell, CreditCardIcon, HandCoins, LogOutIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useState } from "react";
import { handleLogout } from "@/actions/auth.action";
import { useRouter } from "next/navigation";

const SideBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Déconnexion de Firebase
      await signOut(auth);

      // Appel du server action pour supprimer la session
      const result = await handleLogout();

      if (result.success) {
        // Redirection côté client
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="h-screen fixed border-r w-10 lg:w-60 border-n-6 flex flex-col items-start justify-between">
      {/* Haut de la sidebar */}
      <div className="z-10 flex flex-col gap-10 lg:gap-24 justify-start items-start py-2 lg:px-10">
        <div className="flex items-center gap-2">
          <HandCoins className="h-8 w-8 text-p-3" />
          <span className="text-2xl text-white pointer-events-none z-10 hidden lg:block">
            SubTrack
          </span>
        </div>
        <div>
          <ul className="space-y-5 lg:space-y-10">
            <li>
              <Link href={"#"} className="flex gap-1 lg:gap-3">
                <CreditCardIcon />
                <span className="text-md hidden lg:block">Abonnements</span>
              </Link>
            </li>
            <li>
              <Link href={"#"} className="flex gap-1 lg:gap-3">
                <Bell />
                <span className="text-md hidden lg:block">Notifications</span>
              </Link>
            </li>
            <li>
              <Link href={"#"} className="flex gap-1 lg:gap-3">
                <SettingsIcon />
                <span className="text-md hidden lg:block">Paramètres</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-6 lg:px-10">
        <button
          onClick={handleClick}
          className="flex items-center gap-3 px-1 lg:px-4 py-1 bg-red-500 rounded-md hover:bg-red-600"
        >
          <LogOutIcon />
          <span className="text-md hidden lg:block">
            {isLoading ? "Déconnexion..." : "Me déconnecter"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
