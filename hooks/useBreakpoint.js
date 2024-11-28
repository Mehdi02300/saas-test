"use client";
import { useState, useEffect } from "react";

export function useBreakpoint() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Screen size updater function
    const updateScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return isLargeScreen;
}
