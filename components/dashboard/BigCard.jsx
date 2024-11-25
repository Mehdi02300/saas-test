"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Graphic from "./Graphic";
import { db } from "@/firebase/firebaseConfig";

const BigCard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subscriptions"));
        const subscriptionsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Trier les abonnements par date d'échéance croissante
        const sortedSubscriptions = subscriptionsArray
          .filter((subscription) => subscription.dueDate) // Filtrer ceux qui ont une dueDate
          .sort((a, b) => a.dueDate.seconds - b.dueDate.seconds); // Trier par dueDate

        // Filtrer les 3 prochains abonnements dont la dueDate est dans les 30 prochains jours
        const currentDate = new Date();
        const next30Days = new Date(currentDate);
        next30Days.setDate(currentDate.getDate() + 30);

        const upcomingSubscriptions = sortedSubscriptions
          .filter((subscription) => {
            const expirationDate = new Date(subscription.dueDate.seconds * 1000);
            return expirationDate >= currentDate && expirationDate <= next30Days;
          })
          .slice(0, 3); // Prendre seulement les 3 premiers

        setSubscriptions(upcomingSubscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const getStatus = (dueDate) => {
    if (!dueDate) return "À renouveler"; // Si la date est undefined, retourner "À renouveler"

    const currentDate = new Date();
    const expirationDate = new Date(dueDate);
    return expirationDate > currentDate ? "Actif" : "À renouveler";
  };

  if (loading) {
    return <p>Chargement des abonnements...</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mx-5 lg:mx-10">
      <div className="lg:w-1/2">
        <Graphic />
      </div>
      <div className="lg:w-1/2 flex flex-col p-5 lg:p-10 bg-n-7 rounded-xl h-[500px]">
        <div className="flex flex-col">
          <h2 className="h4">Prochains renouvellements</h2>
          <p className="body-2 text-n-3">Abonnements à renouveler dans les 30 prochains jours</p>
        </div>
        <div className="flex flex-col justify-between gap-2">
          {subscriptions.length === 0 ? (
            <p>Aucun abonnement à renouveler dans les 30 prochains jours.</p>
          ) : (
            subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-n-9 rounded-xl p-5 mt-5">
                <div className="flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="h5">{subscription.serviceName}</span>
                    <span className="h5">{subscription.cost} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-2 text-n-3">
                      {subscription.dueDate
                        ? `Échéance : ${new Date(
                            subscription.dueDate.seconds * 1000
                          ).toLocaleDateString()}`
                        : "Échéance inconnue"}
                    </span>
                    <span
                      className={`body-2 ${
                        getStatus(subscription.dueDate?.seconds * 1000) === "Actif"
                          ? "text-green-500"
                          : "text-orange-500"
                      }`}
                    >
                      {getStatus(subscription.dueDate?.seconds * 1000)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BigCard;
