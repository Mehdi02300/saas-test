"use client";

import { handleDelete } from "@/actions/deleteSub.action";
import { useState } from "react";

const DeleteModal = ({ isOpen, onClose, subscription }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDeleteClick = async () => {
    setLoading(true);
    try {
      await handleDelete(subscription.id);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-n-7 p-6 rounded-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Confirmer la suppression</h3>
        <p className="text-n-3 mb-6">
          Êtes-vous sûr de vouloir supprimer l'abonnement à {subscription.serviceName} ? Cette
          action est irréversible.
        </p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-n-6 rounded hover:bg-n-5">
            Annuler
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 disabled:opacity-50"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
