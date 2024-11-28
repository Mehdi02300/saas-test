"use client";
import { Bell, CreditCardIcon, HandCoins, HouseIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useState } from "react";
import { handleLogout } from "@/actions/auth.action";
import { useRouter } from "next/navigation";

const MENU_ITEMS = [
  { icon: <HouseIcon />, text: "Tableau de bord", href: "/dashboard" },
  { icon: <CreditCardIcon />, text: "Abonnements", href: "/dashboard/subscriptions" },
  { icon: <Bell />, text: "Notifications", href: "#" },
  { icon: <SettingsIcon />, text: "Paramètres", href: "#" },
];

const SideBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      const result = await handleLogout();

      if (result.success) {
        router.push("/login");
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="h-screen fixed border-r w-10 lg:w-60 border-n-6 flex flex-col items-start justify-between">
      <div className="z-10 flex flex-col gap-10 lg:gap-24 justify-start items-start py-2 lg:px-10">
        <div className="flex items-center gap-2">
          <HandCoins className="h-8 w-8 text-p-3" />
          <span className="text-2xl text-white pointer-events-none z-10 hidden lg:block">
            SubTrack
          </span>
        </div>

        <nav>
          <ul className="space-y-5 lg:space-y-10">
            {MENU_ITEMS.map(({ icon, text, href }) => (
              <li key={text}>
                <Link href={href} className="flex items-end gap-1 lg:gap-3">
                  {icon}
                  <span className="text-sm hidden lg:block">{text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mb-6 lg:mx-10">
        <button
          onClick={handleClick}
          className="flex items-center gap-3 px-1 lg:px-5 py-1 bg-red-500 rounded-md hover:bg-red-600"
          disabled={isLoading}
        >
          <LogOutIcon />
          <span className="text-sm hidden lg:block">
            {isLoading ? "Déconnexion..." : "Me déconnecter"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
