"use client";

import React, { useState } from "react";
import { handleSubmit } from "@/actions/addSub.action";
import { useRouter } from "next/navigation";

const AddSub = () => {
  const [serviceName, setServiceName] = useState("");
  const [cost, setCost] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminderOption, setReminderOption] = useState("twoDays");
  const [frequency, setFrequency] = useState("monthly");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleActionSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = {
        serviceName,
        cost,
        dueDate,
        reminderOption,
        frequency,
      };

      await handleSubmit(formData);

      setSuccessMessage("Abonnement ajouté avec succès !");

      // Réinitialiser le formulaire
      setServiceName("");
      setCost("");
      setDueDate("");
      setReminderOption("twoDays");
      setFrequency("monthly");

      // Rafraîchir la page après 1 seconde
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      action={handleActionSubmit}
      className="flex flex-col gap-6 p-4 bg-n-9 rounded-lg shadow-lg max-w-md mx-auto"
    >
      <label className="flex flex-col text-white font-medium">
        Nom du service :
        <input
          type="text"
          name="serviceName"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Netflix, Spotify..."
          required
          className="mt-2 p-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label className="flex flex-col text-white font-medium">
        Coût mensuel :
        <input
          type="number"
          name="cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          step="0.01"
          placeholder="15.99"
          required
          className="mt-2 p-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label className="flex flex-col text-white font-medium">
        Date d'échéance :
        <input
          type="date"
          name="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="mt-2 p-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label className="flex flex-col text-white font-medium">
        Rappel :
        <select
          name="reminderOption"
          value={reminderOption}
          onChange={(e) => setReminderOption(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">Aucun rappel</option>
          <option value="twoDays">2 jours avant</option>
          <option value="oneWeek">1 semaine avant</option>
          <option value="both">Les deux</option>
        </select>
      </label>

      <label className="flex flex-col text-white font-medium">
        Fréquence :
        <select
          name="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="monthly">Mensuel</option>
          <option value="yearly">Annuel</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? "Ajout en cours..." : "Ajouter l'abonnement"}
      </button>

      {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}
    </form>
  );
};

export default AddSub;
