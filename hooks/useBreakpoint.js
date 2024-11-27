import { useState, useEffect } from "react";

export function useBreakpoint() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg: 1024px (selon Tailwind CSS)
    };

    updateScreenSize(); // Vérifiez la taille de l'écran initialement
    window.addEventListener("resize", updateScreenSize); // Écoute les changements de taille

    return () => window.removeEventListener("resize", updateScreenSize); // Nettoyage
  }, []);

  return isLargeScreen;
}
