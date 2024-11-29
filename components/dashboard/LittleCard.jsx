"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import { CreditCardIcon, EuroIcon } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { updateSubscriptionDates } from "@/actions/updateDueDates.action";

const LittleCard = () => {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    activeSubscriptions: 0,
    potentialSavings: 0,
    percentageChange: 0,
    renewalsComing: 0,
    loading: true,
  });

  useEffect(() => {
    const calculateStats = (subscriptions) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const fifteenDaysFromNow = new Date(currentDate);
      fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);

      return subscriptions.reduce(
        (acc, sub) => {
          if (!sub.isActive) return acc;

          const dueDate = new Date(sub.dueDate);
          const cost = parseFloat(sub.cost) || 0;
          const monthlyCost = sub.frequency === "yearly" ? cost / 12 : cost;

          if (
            sub.frequency === "monthly" &&
            dueDate.getMonth() === currentMonth &&
            dueDate.getFullYear() === currentYear
          ) {
            acc.currentMonthExpenses += cost;
          } else if (sub.frequency === "yearly") {
            acc.currentMonthExpenses += monthlyCost;
          }

          if (
            sub.frequency === "monthly" &&
            dueDate.getMonth() === lastMonth &&
            dueDate.getFullYear() === lastMonthYear
          ) {
            acc.lastMonthExpenses += cost;
          } else if (sub.frequency === "yearly") {
            acc.lastMonthExpenses += monthlyCost;
          }

          acc.activeCount++;
          if (dueDate >= currentDate && dueDate <= fifteenDaysFromNow) {
            acc.renewalsCount++;
          }

          return acc;
        },
        {
          currentMonthExpenses: 0,
          lastMonthExpenses: 0,
          activeCount: 0,
          renewalsCount: 0,
        }
      );
    };

    const fetchSubscriptions = async (user) => {
      try {
        const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const subscriptions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        await updateSubscriptionDates(subscriptions);

        const { currentMonthExpenses, lastMonthExpenses, activeCount, renewalsCount } =
          calculateStats(subscriptions);

        const percentageChange =
          lastMonthExpenses > 0
            ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
            : 0;

        setStats({
          totalExpenses: currentMonthExpenses,
          activeSubscriptions: activeCount,
          potentialSavings: 0,
          percentageChange: percentageChange.toFixed(1),
          renewalsComing: renewalsCount,
          loading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchSubscriptions(user);
      else setStats((prev) => ({ ...prev, loading: false }));
    });

    return () => unsubscribe();
  }, []);

  const cards = [
    {
      title: "Dépenses mensuelles",
      icon: <EuroIcon />,
      number: stats.loading ? "..." : `${stats.totalExpenses.toFixed(2)} €`,
      description: stats.loading
        ? "Chargement..."
        : `${stats.percentageChange > 0 ? "+" : ""}${
            stats.percentageChange
          }% par rapport au mois dernier`,
    },
    {
      title: "Abonnements actifs",
      icon: <CreditCardIcon />,
      number: stats.loading ? "..." : `${stats.activeSubscriptions}`,
      description: stats.loading
        ? "Chargement..."
        : `${stats.renewalsComing} renouvellement${
            stats.renewalsComing > 1 ? "s" : ""
          } à venir dans les 15 prochains jours`,
    },
    {
      title: "Economies potentielles",
      icon: <EuroIcon />,
      number: stats.loading ? "..." : `${stats.potentialSavings.toFixed(2)} €`,
      description: stats.loading
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
