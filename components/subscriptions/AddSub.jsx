"use client";
import React, { useState } from "react";
import { handleSubmit } from "@/actions/addSub.action";

const INITIAL_FORM = {
  serviceName: "",
  cost: "",
  dueDate: "",
  reminderOption: "twoDays",
  frequency: "monthly",
};

const AddSub = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const handleActionSubmit = async () => {
    setStatus({ loading: true, error: "", success: "" });

    try {
      await handleSubmit(form);
      setStatus({ loading: false, error: "", success: "Abonnement ajouté avec succès !" });
      setForm(INITIAL_FORM);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
    }
  };

  return (
    <form
      action={handleActionSubmit}
      className="flex flex-col gap-6 p-4 bg-n-9 rounded-lg shadow-lg max-w-md mx-auto"
    >
      {["serviceName", "cost", "dueDate"].map((field) => (
        <label key={field} className="flex flex-col text-white font-medium">
          {field === "serviceName"
            ? "Nom du service :"
            : field === "cost"
            ? "Coût mensuel :"
            : "Date d'échéance :"}
          <input
            type={field === "cost" ? "number" : field === "dueDate" ? "date" : "text"}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            placeholder={
              field === "serviceName" ? "Netflix, Spotify..." : field === "cost" ? "15.99" : ""
            }
            step={field === "cost" ? "0.01" : undefined}
            required
            className="mt-2 p-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      ))}

      {[
        {
          name: "reminderOption",
          label: "Rappel :",
          options: [
            { value: "none", label: "Aucun rappel" },
            { value: "twoDays", label: "2 jours avant" },
            { value: "oneWeek", label: "1 semaine avant" },
            { value: "both", label: "Les deux" },
          ],
        },
        {
          name: "frequency",
          label: "Fréquence :",
          options: [
            { value: "monthly", label: "Mensuel" },
            { value: "yearly", label: "Annuel" },
          ],
        },
      ].map((select) => (
        <label key={select.name} className="flex flex-col text-white font-medium">
          {select.label}
          <select
            value={form[select.name]}
            onChange={(e) => setForm({ ...form, [select.name]: e.target.value })}
            className="mt-2 p-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {select.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      <button
        type="submit"
        disabled={status.loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {status.loading ? "Ajout en cours..." : "Ajouter l'abonnement"}
      </button>

      {status.success && <p className="text-green-600 text-center mt-4">{status.success}</p>}
      {status.error && <p className="text-red-600 text-center mt-4">{status.error}</p>}
    </form>
  );
};

export default AddSub;
