// actions/updateMonthlyExpenses.action.js
"use server";

import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

async function calculateMonthlyTotal(subscriptions, targetDate) {
  let total = 0;

  subscriptions.forEach((sub) => {
    // Skip si l'abonnement est inactif
    if (!sub.isActive) return;

    const dueDate = new Date(sub.dueDate);
    const cost = parseFloat(sub.cost) || 0;

    if (sub.frequency === "yearly") {
      // Pour les abonnements annuels, diviser par 12
      total += cost / 12;
    } else if (sub.frequency === "monthly") {
      // Pour les abonnements mensuels, vérifier si l'échéance est dans le mois cible
      if (
        dueDate.getMonth() === targetDate.getMonth() &&
        dueDate.getFullYear() === targetDate.getFullYear()
      ) {
        total += cost;
      }
    }
  });

  return total;
}

export async function updateMonthlyExpenses(userId) {
  try {
    // 1. Récupérer tous les abonnements de l'utilisateur
    const subsQuery = query(collection(db, "subscriptions"), where("userId", "==", userId));
    const subsSnapshot = await getDocs(subsQuery);
    const subscriptions = subsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // 2. Calculer les montants pour les 5 derniers mois
    const months = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthId = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      const amount = await calculateMonthlyTotal(subscriptions, date);
      months.push({ month: monthId, amount });
    }

    // 3. Mettre à jour ou créer les enregistrements dans monthlyExpenses
    for (const monthData of months) {
      const expenseQuery = query(
        collection(db, "monthlyExpenses"),
        where("userId", "==", userId),
        where("month", "==", monthData.month)
      );

      const expenseSnapshot = await getDocs(expenseQuery);

      if (expenseSnapshot.empty) {
        // Créer nouveau
        await addDoc(collection(db, "monthlyExpenses"), {
          userId,
          month: monthData.month,
          amount: monthData.amount,
          createdAt: new Date().toISOString(),
        });
      } else {
        // Mettre à jour existant
        const docId = expenseSnapshot.docs[0].id;
        await updateDoc(doc(db, "monthlyExpenses", docId), {
          amount: monthData.amount,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur mise à jour dépenses:", error);
    throw new Error("Erreur lors de la mise à jour des dépenses mensuelles");
  }
}
