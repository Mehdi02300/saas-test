import { useState } from "react";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";

const SubscriptionCard = ({ subscription, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  return (
    <>
      <div className="bg-n-7 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="h5">{subscription.serviceName}</h3>
          <span
            className={`px-3 py-1 rounded text-sm ${
              subscription.isActive
                ? "bg-green-500/10 text-green-500"
                : "bg-orange-500/10 text-orange-500"
            }`}
          >
            {subscription.isActive ? "Actif" : "Inactif"}
          </span>
        </div>
        <div className="space-y-2 text-n-3">
          <p className="text-xl font-semibold text-white">{subscription.cost} €/mois</p>
          <p>Échéance : {new Date(subscription.dueDate).toLocaleDateString()}</p>
          <p>Fréquence : {subscription.frequency === "monthly" ? "Mensuel" : "Annuel"}</p>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex-1 px-4 py-2 bg-n-6 rounded hover:bg-n-5"
          >
            Modifier
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 px-4 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        subscription={subscription}
      />

      <UpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        subscription={subscription}
      />
    </>
  );
};

export default SubscriptionCard;
