"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import { CreditCardIcon, EuroIcon } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

const LittleCard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [renewalsComing, setRenewalsComing] = useState(0);

  useEffect(() => {
    const fetchSubscriptions = async (user) => {
      try {
        if (!user) {
          throw new Error("Utilisateur non connecté");
        }

        const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        const subscriptionsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Subscriptions trouvées:", subscriptionsArray);

        let currentMonthExpenses = 0;
        let lastMonthExpenses = 0;
        let activeCount = 0;
        let renewalsCount = 0;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const fifteenDaysFromNow = new Date();
        fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);

        subscriptionsArray.forEach((subscription) => {
          const dueDate = new Date(subscription.dueDate);
          const cost = parseFloat(subscription.cost) || 0;
          const frequency = subscription.frequency || "monthly";
          const isActive = subscription.isActive; // Utiliser la propriété isActive directement

          const monthlyCost =
            frequency === "yearly"
              ? cost / 12
              : frequency === "quarterly"
              ? cost / 3
              : frequency === "weekly"
              ? cost * 4
              : cost;

          // Calcul pour le mois actuel
          if (isActive) {
            if (
              frequency === "monthly" &&
              dueDate.getMonth() === currentMonth &&
              dueDate.getFullYear() === currentYear
            ) {
              currentMonthExpenses += cost;
            } else if (frequency !== "monthly") {
              currentMonthExpenses += monthlyCost;
            }
            activeCount++;
          }

          // Calcul pour le mois précédent
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

          if (isActive) {
            if (
              frequency === "monthly" &&
              dueDate.getMonth() === lastMonth &&
              dueDate.getFullYear() === lastMonthYear
            ) {
              lastMonthExpenses += cost;
            } else if (frequency !== "monthly") {
              lastMonthExpenses += monthlyCost;
            }
          }

          // Renouvellements à venir
          if (dueDate >= currentDate && dueDate <= fifteenDaysFromNow) {
            renewalsCount++;
          }
        });

        // Calcul du pourcentage de changement
        let percentageChangeValue = 0;
        if (lastMonthExpenses > 0) {
          percentageChangeValue =
            ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
        }

        console.log("Statistiques calculées:", {
          currentMonthExpenses,
          lastMonthExpenses,
          percentageChange: percentageChangeValue,
          activeCount,
          renewalsCount,
        });

        setTotalExpenses(currentMonthExpenses);
        setActiveSubscriptions(activeCount);
        setPotentialSavings(0);
        setPercentageChange(percentageChangeValue.toFixed(1));
        setRenewalsComing(renewalsCount);
        setSubscriptions(subscriptionsArray);
      } catch (error) {
        console.error("Erreur détaillée:", error);
        setTotalExpenses(0);
        setActiveSubscriptions(0);
        setPotentialSavings(0);
        setPercentageChange(0);
        setRenewalsComing(0);
      } finally {
        setLoading(false);
      }
    };

    // Écouter les changements d'état d'authentification
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Utilisateur authentifié:", user.uid);
        fetchSubscriptions(user);
      } else {
        console.log("Aucun utilisateur connecté");
        setLoading(false);
      }
    });

    // Nettoyer l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  const cards = [
    {
      title: "Dépenses mensuelles",
      icon: <EuroIcon />,
      number: loading ? "..." : `${totalExpenses.toFixed(2)} €`,
      description: loading
        ? "Chargement..."
        : `${percentageChange > 0 ? "+" : ""}${percentageChange}% par rapport au mois dernier`,
    },
    {
      title: "Abonnements actifs",
      icon: <CreditCardIcon />,
      number: loading ? "..." : `${activeSubscriptions}`,
      description: loading
        ? "Chargement..."
        : `${renewalsComing} renouvellement${
            renewalsComing > 1 ? "s" : ""
          } à venir dans les 15 prochains jours`,
    },
    {
      title: "Economies potentielles",
      icon: <EuroIcon />,
      number: loading ? "..." : `${potentialSavings.toFixed(2)} €`,
      description: loading
        ? "Chargement..."
        : "Suggestions de l'IA pour faire de l'économie à venir.",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 my-5 ml-5 lg:m-10">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex lg:flex-1 flex-col bg-n-7 rounded-xl gap-3 lg:gap-5 p-5 lg:p-7"
        >
          <div className="flex justify-between items-center">
            <span className="h6">{card.title}</span>
            <span className="text-n-3">{card.icon}</span>
          </div>
          <div className="h3">{card.number}</div>
          <div className="body-3 text-n-3">{card.description}</div>
        </div>
      ))}
    </div>
  );
};

export default LittleCard;
