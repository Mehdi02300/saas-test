"use server";

import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

export async function getExpensesHistory(userId) {
  try {
    function getMonthName(monthNumber) {
      const months = [
        "Jan",
        "Fév",
        "Mars",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ];
      return months[monthNumber];
    }

    function getLast5Months() {
      const months = [];
      const today = new Date();

      for (let i = 4; i >= 0; i--) {
        const date = new Date();
        date.setMonth(today.getMonth() - i);
        months.push({
          mois: getMonthName(date.getMonth()),
          date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        });
      }

      return months;
    }

    const monthsRange = getLast5Months();

    const expensesQuery = query(
      collection(db, "monthlyExpenses"),
      where("userId", "==", userId),
      orderBy("month", "desc"),
      limit(5)
    );

    const snapshot = await getDocs(expensesQuery);
    const expensesMap = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      expensesMap[data.month] = data.amount;
    });

    const result = monthsRange.map((month) => ({
      mois: month.mois,
      montant: expensesMap[month.date] || 0,
    }));

    return result;
  } catch (error) {
    console.error("Erreur complète:", error);
    throw new Error(`Erreur lors de la récupération de l'historique: ${error.message}`);
  }
}
