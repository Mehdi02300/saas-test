"use server";

import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { cookies } from "next/headers";

async function updateMonthlyExpenses(userId) {
  try {
    const subsQuery = query(collection(db, "subscriptions"), where("userId", "==", userId));
    const subsSnapshot = await getDocs(subsQuery);
    const subscriptions = subsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Calculate expenses for the last 5 months
    const months = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (4 - i));
      return {
        month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        date,
      };
    }).map(({ month, date }) => ({
      month,
      amount: subscriptions.reduce((total, sub) => {
        if (!sub.isActive) return total;

        const cost = parseFloat(sub.cost) || 0;
        if (sub.frequency === "yearly") return total + cost / 12;

        const dueDate = new Date(sub.dueDate);
        return dueDate.getMonth() === date.getMonth() &&
          dueDate.getFullYear() === date.getFullYear()
          ? total + cost
          : total;
      }, 0),
    }));

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
          amount,
          userId,
          month,
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
    return { error: "Erreur lors de la mise à jour des dépenses mensuelles" };
  }
}

function calculateReminderDates(dueDate, reminderType) {
  const dueDateObj = new Date(dueDate);
  const twoDaysDate = new Date(dueDateObj);
  const oneWeekDate = new Date(dueDateObj);

  twoDaysDate.setDate(twoDaysDate.getDate() - 2);
  oneWeekDate.setDate(oneWeekDate.getDate() - 7);

  const reminderConfig = {
    none: { twoDays: null, oneWeek: null },
    twoDays: { twoDays: twoDaysDate.toISOString(), oneWeek: null },
    oneWeek: { twoDays: null, oneWeek: oneWeekDate.toISOString() },
    both: { twoDays: twoDaysDate.toISOString(), oneWeek: oneWeekDate.toISOString() },
  };

  return {
    type: reminderType,
    dates: reminderConfig[reminderType] || reminderConfig.none,
  };
}

export async function handleSubmit(formData) {
  try {
    const session = cookies().get("session")?.value;
    if (!session) throw new Error("Non authentifié");

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: session }),
      }
    );

    if (!response.ok) throw new Error("Token invalide");

    const {
      users: [{ localId: userId }],
    } = await response.json();

    const subscription = {
      userId,
      serviceName: formData.serviceName,
      cost: parseFloat(formData.cost),
      dueDate: new Date(formData.dueDate).toISOString(),
      frequency: formData.frequency,
      reminders: calculateReminderDates(formData.dueDate, formData.reminderOption),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, "subscriptions"), subscription);
    await updateMonthlyExpenses(userId);

    return { success: true };
  } catch (error) {
    throw new Error("Erreur lors de l'ajout de l'abonnement");
  }
}
