// actions/updateDueDates.action.js
"use server";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function updateSubscriptionDates(subscriptions) {
  const now = new Date();

  try {
    for (const sub of subscriptions) {
      if (!sub.isActive) continue;

      const dueDate = new Date(sub.dueDate);
      if (dueDate <= now) {
        const newDueDate = new Date(dueDate);

        if (sub.frequency === "monthly") {
          newDueDate.setMonth(newDueDate.getMonth() + 1);
        } else if (sub.frequency === "yearly") {
          newDueDate.setFullYear(newDueDate.getFullYear() + 1);
        }

        await updateDoc(doc(db, "subscriptions", sub.id), {
          dueDate: newDueDate.toISOString(),
        });
      }
    }
  } catch (error) {
    console.error("Error updating dates:", error);
  }
}
