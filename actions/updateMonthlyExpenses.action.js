"use server";

import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

async function calculateMonthlyTotal(subscriptions, targetDate) {
  return subscriptions.reduce((total, sub) => {
    if (!sub.isActive) return total;

    const dueDate = new Date(sub.dueDate);
    const cost = parseFloat(sub.cost) || 0;

    if (sub.frequency === "yearly") return total + cost / 12;

    if (
      sub.frequency === "monthly" &&
      dueDate.getMonth() === targetDate.getMonth() &&
      dueDate.getFullYear() === targetDate.getFullYear()
    ) {
      return total + cost;
    }

    return total;
  }, 0);
}

export async function updateMonthlyExpenses(userId) {
  try {
    // Get all user subscriptions
    const subsQuery = query(collection(db, "subscriptions"), where("userId", "==", userId));
    const subsSnapshot = await getDocs(subsQuery);
    const subscriptions = subsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Calculate last 5 months expenses
    const months = await Promise.all(
      Array.from({ length: 5 }, async (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (4 - i));
        const monthId = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const amount = await calculateMonthlyTotal(subscriptions, date);
        return { month: monthId, amount };
      })
    );

    // Update or create monthly expenses records
    await Promise.all(
      months.map(async ({ month, amount }) => {
        const expenseQuery = query(
          collection(db, "monthlyExpenses"),
          where("userId", "==", userId),
          where("month", "==", month)
        );
        const expenseSnapshot = await getDocs(expenseQuery);

        const data = {
          userId,
          month,
          amount,
          ...(expenseSnapshot.empty
            ? { createdAt: new Date().toISOString() }
            : { updatedAt: new Date().toISOString() }),
        };

        return expenseSnapshot.empty
          ? addDoc(collection(db, "monthlyExpenses"), data)
          : updateDoc(doc(db, "monthlyExpenses", expenseSnapshot.docs[0].id), data);
      })
    );

    return { success: true };
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour des dépenses mensuelles");
  }
}
