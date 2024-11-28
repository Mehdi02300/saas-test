"use server";

import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

// French month names abbreviations
const MONTHS = [
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

function generateMonthsRange() {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (4 - index));

    return {
      mois: MONTHS[date.getMonth()],
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    };
  });
}

export async function getExpensesHistory(userId) {
  try {
    // Get last 5 months of expenses
    const expensesQuery = query(
      collection(db, "monthlyExpenses"),
      where("userId", "==", userId),
      orderBy("month", "desc"),
      limit(5)
    );

    const snapshot = await getDocs(expensesQuery);
    const expensesMap = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[data.month] = data.amount;
      return acc;
    }, {});

    // Map expenses to months range
    return generateMonthsRange().map((month) => ({
      mois: month.mois,
      montant: expensesMap[month.date] || 0,
    }));
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'historique");
  }
}
