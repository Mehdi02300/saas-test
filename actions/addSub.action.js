"use server";

import { addDoc, collection } from "firebase/firestore"; // Importation nécessaire
import { db } from "@/firebase/firebaseConfig"; // Assurez-vous que le db est correctement importé

export const handleSubmit = async (data) => {
  const { serviceName, cost, dueDate, reminderOption, frequency } = data;

  // Convertir la dueDate en objet Date
  const dueDateObj = new Date(dueDate); // Conversion de la chaîne en objet Date

  // Debug : Vérifiez les données reçues
  console.log("Données reçues avant envoi à Firebase :", {
    serviceName,
    cost,
    dueDate: dueDateObj, // Assurez-vous que la date est bien un objet Date
    reminderOption,
    frequency,
  });

  try {
    // Ajout de l'abonnement dans Firebase
    await addDoc(collection(db, "subscriptions"), {
      serviceName,
      cost,
      dueDate: dueDateObj, // Stocker la date sous forme d'objet Date
      reminderOption,
      frequency,
    });
  } catch (error) {
    throw new Error("Erreur lors de l'ajout dans Firebase : " + error.message);
  }
};
