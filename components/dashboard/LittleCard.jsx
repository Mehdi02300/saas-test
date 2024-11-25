"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { CreditCardIcon, EuroIcon } from "lucide-react";

const LittleCard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [renewalsComing, setRenewalsComing] = useState(0);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subscriptions"));
        const subscriptionsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubscriptions(subscriptionsArray);

        let currentMonthExpenses = 0;
        let lastMonthExpenses = 0;
        let activeCount = 0;
        let potentialSavingsAmount = 0;
        let renewalsCount = 0;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastMonthYear = lastMonthDate.getFullYear();

        const fifteenDaysFromNow = new Date();
        fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);

        subscriptionsArray.forEach((subscription) => {
          const dueDate = new Date(subscription.dueDate?.seconds * 1000);
          const cost = subscription.cost || 0;
          const frequency = subscription.frequency || "monthly"; // Par défaut, mensuel
          const isActive = dueDate > currentDate; // Si la date d'échéance est dans le futur, l'abonnement est actif.

          // Calcul du coût mensuel basé sur la fréquence
          const monthlyCost =
            frequency === "yearly"
              ? cost / 12 // Diviser le coût annuel par 12 pour obtenir le coût mensuel
              : frequency === "quarterly"
              ? cost / 3 // Diviser le coût trimestriel par 3 pour obtenir le coût mensuel
              : frequency === "weekly"
              ? cost / 4 // Diviser le coût hebdomadaire par 4 pour obtenir le coût mensuel
              : cost; // Par défaut, pour un abonnement mensuel, on prend le coût directement.

          // Console log pour déboguer
          console.log({
            id: subscription.id,
            frequency,
            dueDate,
            isActive,
            monthlyCost,
            includedInMonthlyExpenses:
              (frequency === "monthly" &&
                dueDate.getMonth() === currentMonth &&
                dueDate.getFullYear() === currentYear) ||
              (frequency !== "monthly" && isActive),
          });

          // Vérification des abonnements mensuels : pris en compte si leur date d'échéance est dans le mois en cours et actifs
          if (
            isActive &&
            frequency === "monthly" &&
            dueDate.getMonth() === currentMonth &&
            dueDate.getFullYear() === currentYear
          ) {
            currentMonthExpenses += cost; // Coût complet pour les abonnements mensuels
          }

          // Vérification des abonnements non mensuels (annuels, trimestriels, etc.) : pris en compte tant qu'ils sont actifs
          if (isActive && frequency !== "monthly") {
            currentMonthExpenses += monthlyCost; // Ajouter le coût mensuel estimé pour les autres fréquences
          }

          // Comptabilisation des abonnements actifs (quel que soit le type)
          if (isActive) {
            activeCount++; // Incrémenter le nombre d'abonnements actifs
          }

          // Renouvellements à venir : dans les 15 jours
          if (dueDate >= currentDate && dueDate <= fifteenDaysFromNow) {
            renewalsCount++;
          }
        });

        let percentageChangeValue = 0;
        if (lastMonthExpenses > 0) {
          percentageChangeValue =
            ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
        }

        setPercentageChange(percentageChangeValue.toFixed(2));
        setTotalExpenses(currentMonthExpenses);
        setActiveSubscriptions(activeCount);
        setPotentialSavings(potentialSavingsAmount);
        setRenewalsComing(renewalsCount);
      } catch (error) {
        console.error("Erreur lors de la récupération des abonnements :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  if (subscriptions.length === 0) {
    return <p>Aucun abonnement trouvé.</p>;
  }

  const cards = [
    {
      title: "Dépenses mensuelles",
      icon: <EuroIcon />,
      number: `${totalExpenses.toFixed(2)} €`,
      description: `${
        percentageChange >= 0 ? "+" : ""
      }${percentageChange}% par rapport au mois dernier`,
    },
    {
      title: "Abonnements actifs",
      icon: <CreditCardIcon />,
      number: `${activeSubscriptions}`,
      description: `${renewalsComing} renouvellements à venir dans les 15 prochains jours`,
    },
    {
      title: "Economies potentielles",
      icon: <EuroIcon />,
      number: `${potentialSavings.toFixed(2)} €`,
      description: "3 suggestions d'optimisation",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 m-5 lg:m-10">
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
