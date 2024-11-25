"use client";

import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Assure-toi d'importer ton instance Firebase
import { collection, getDocs } from "firebase/firestore";

const SubList = () => {
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
        setSubscriptions(subscriptionsArray);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return <p>Chargement des abonnements...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {subscriptions.length === 0 ? (
        <p>Aucun abonnement ajouté.</p>
      ) : (
        subscriptions.map((subscription) => (
          <div key={subscription.id} className="p-4 border rounded shadow">
            <h3 className="font-bold">{subscription.serviceName}</h3>
            <p>Coût : {subscription.cost} €/mois</p>
            <p>Date d'échéance : {subscription.startDate}</p>
            <p>Fréquence : {subscription.frequency}</p>
            <p>Rappel : {subscription.reminderOption}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SubList;
