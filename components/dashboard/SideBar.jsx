"use client";

import { Bell, CreditCardIcon, HandCoins, LogOutIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

const SideBar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirection vers la page d'accueil après déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  return (
    <aside className="h-screen border-r border-n-6 flex flex-col justify-between">
      {/* Haut de la sidebar */}
      <div className="z-10 flex flex-col gap-10 lg:gap-24 justify-start items-start py-4 lg:py-6 px-5 lg:px-10">
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
                <span className="text-lg hidden lg:block">Abonnements</span>
              </Link>
            </li>
            <li>
              <Link href={"#"} className="flex gap-1 lg:gap-3">
                <Bell />
                <span className="text-lg hidden lg:block">Notifications</span>
              </Link>
            </li>
            <li>
              <Link href={"#"} className="flex gap-1 lg:gap-3">
                <SettingsIcon />
                <span className="text-lg hidden lg:block">Paramètres</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="py-4 px-5 lg:px-10">
        <button
          onClick={handleLogout}
          className="flex gap-3 px-4 py-2 bg-red-500 rounded-md hover:bg-red-600"
        >
          <LogOutIcon />
          <span className="text-lg hidden lg:block">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
