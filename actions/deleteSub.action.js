"use server";

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function handleDelete(subscriptionId) {
  try {
    await deleteDoc(doc(db, "subscriptions", subscriptionId));
    return { success: true };
  } catch (error) {
    throw new Error("Erreur lors de la suppression de l'abonnement");
  }
}
