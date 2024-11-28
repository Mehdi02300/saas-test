"use server";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function handleUpdate(subscriptionId, data) {
  try {
    const refSub = doc(db, "subscriptions", subscriptionId);

    await updateDoc(refSub, data);

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification de l'abonnement:", error);
    throw new Error("Erreur lors de la modification de l'abonnement");
  }
}
