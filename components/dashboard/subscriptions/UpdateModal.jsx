"use client";

import { handleUpdate } from "@/actions/updateSub.action";
import { useEffect, useState } from "react";

const UpdateModal = ({ isOpen, onClose, subscription }) => {
  const [serviceName, setServiceName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [cost, setCost] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [frequency, setFrequency] = useState("mensuel");
  const [reminders, setReminders] = useState({ type: "none", dates: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subscription) {
      setServiceName(subscription.serviceName || "");
      setDueDate(convertDate(subscription.dueDate));
      setCost(subscription.cost || 0);
      setIsActive(subscription.isActive || false);
      setFrequency(subscription.frequency || "mensuel");
      setReminders(subscription.reminders || { type: "none", dates: {} });
    }
  }, [subscription]);

  const convertDate = (dueDate) => {
    if (!dueDate) return "";
    const d = new Date(dueDate);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (!isOpen) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await handleUpdate(subscription.id, {
        serviceName,
        dueDate,
        cost: parseFloat(cost),
        isActive,
        frequency,
        reminders,
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (erreur) {
      console.error("Erreur lors de la modification :", error);
      alert("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed px-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-n-7 p-6 rounded-xl max-w-md w-full">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
              Nom du service
            </label>
            <input
              type="text"
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Date d’échéance
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Prix (€)
            </label>
            <input
              type="number"
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              step="0.01"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Actif
            </label>
          </div>

          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
              Fréquence
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="monthly">Mensuel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              id="reminders"
              value={reminders.type}
              onChange={(e) => setReminders({ ...reminders, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="none">Aucun rappel</option>
              <option value="twoDays">2 jours avant</option>
              <option value="oneWeek">1 semaine avant</option>
              <option value="both">Les deux</option>
            </select>
          </div>

          <button
            type="submit"
            className={`mt-4 w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Modification en cours..." : "Modifier l'abonnement"}
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-n-6 rounded hover:bg-n-5">
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
