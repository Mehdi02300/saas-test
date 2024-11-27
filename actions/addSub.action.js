"use server";

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { cookies } from "next/headers";
import { query, where, getDocs, updateDoc, doc } from "firebase/firestore";

// 1. Ajout de la fonction updateMonthlyExpenses ici même
async function updateMonthlyExpenses(userId) {
  try {
    // Récupérer tous les abonnements de l'utilisateur
    const subsQuery = query(collection(db, "subscriptions"), where("userId", "==", userId));

    const subsSnapshot = await getDocs(subsQuery);
    const subscriptions = subsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Calculer pour les 5 derniers mois
    const months = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthId = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      let totalAmount = 0;

      // Calculer le total pour ce mois
      subscriptions.forEach((sub) => {
        if (sub.isActive === false) return;

        const cost = parseFloat(sub.cost) || 0;
        if (sub.frequency === "yearly") {
          totalAmount += cost / 12;
        } else if (sub.frequency === "monthly") {
          const dueDate = new Date(sub.dueDate);
          if (
            dueDate.getMonth() === date.getMonth() &&
            dueDate.getFullYear() === date.getFullYear()
          ) {
            totalAmount += cost;
          }
        }
      });

      months.push({ month: monthId, amount: totalAmount });
    }

    // Mettre à jour la collection monthlyExpenses
    for (const monthData of months) {
      const expenseQuery = query(
        collection(db, "monthlyExpenses"),
        where("userId", "==", userId),
        where("month", "==", monthData.month)
      );

      const expenseSnapshot = await getDocs(expenseQuery);

      if (expenseSnapshot.empty) {
        await addDoc(collection(db, "monthlyExpenses"), {
          userId,
          month: monthData.month,
          amount: monthData.amount,
          createdAt: new Date().toISOString(),
        });
      } else {
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
    return { error: "Erreur lors de la mise à jour des dépenses mensuelles" };
  }
}

function calculateReminderDates(dueDate, reminderType) {
  const dueDateObj = new Date(dueDate);

  const twoDaysDate = new Date(dueDateObj);
  twoDaysDate.setDate(twoDaysDate.getDate() - 2);

  const oneWeekDate = new Date(dueDateObj);
  oneWeekDate.setDate(oneWeekDate.getDate() - 7);

  switch (reminderType) {
    case "none":
      return {
        type: "none",
        dates: {
          twoDays: null,
          oneWeek: null,
        },
      };
    case "twoDays":
      return {
        type: "twoDays",
        dates: {
          twoDays: twoDaysDate.toISOString(),
          oneWeek: null,
        },
      };
    case "oneWeek":
      return {
        type: "oneWeek",
        dates: {
          twoDays: null,
          oneWeek: oneWeekDate.toISOString(),
        },
      };
    case "both":
      return {
        type: "both",
        dates: {
          twoDays: twoDaysDate.toISOString(),
          oneWeek: oneWeekDate.toISOString(),
        },
      };
    default:
      return {
        type: "none",
        dates: {
          twoDays: null,
          oneWeek: null,
        },
      };
  }
}

export async function handleSubmit(formData) {
  try {
    const session = cookies().get("session")?.value;
    if (!session) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: session }),
      }
    );

    if (!response.ok) {
      throw new Error("Token invalide");
    }

    const userData = await response.json();
    const userId = userData.users[0].localId;

    // Calculer les dates de rappel
    const reminders = calculateReminderDates(formData.dueDate, formData.reminderOption);

    // Créer l'objet abonnement
    const subscription = {
      userId,
      serviceName: formData.serviceName,
      cost: parseFloat(formData.cost),
      dueDate: new Date(formData.dueDate).toISOString(),
      frequency: formData.frequency,
      reminders,
      isActive: true, // Ajout de cette propriété
      createdAt: new Date().toISOString(),
    };

    // Ajouter à Firestore
    const docRef = await addDoc(collection(db, "subscriptions"), subscription);
    console.log("Abonnement ajouté:", docRef.id);

    // Mettre à jour les dépenses mensuelles
    await updateMonthlyExpenses(userId);

    return { success: true };
  } catch (error) {
    console.error("Erreur détaillée:", error);
    throw new Error("Erreur lors de l'ajout de l'abonnement");
  }
}
