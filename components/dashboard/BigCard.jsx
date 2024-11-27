"use client";
import React, { useEffect, useState } from "react";
import Graphic from "./Graphic";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const BigCard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async (user) => {
      try {
        console.log("Récupération pour user:", user.uid);

        // Requête Firestore
        const q = query(
          collection(db, "subscriptions"),
          where("userId", "==", user.uid),
          orderBy("dueDate", "asc")
        );

        const querySnapshot = await getDocs(q);
        console.log("Docs trouvés:", querySnapshot.size);

        const allSubs = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Document data:", doc.id, data);
          return {
            id: doc.id,
            ...data,
          };
        });

        // Filtre pour les 30 prochains jours
        const currentDate = new Date();
        console.log("Date actuelle:", currentDate);

        const next30Days = new Date();
        next30Days.setDate(next30Days.getDate() + 30);
        console.log("Date limite:", next30Days);

        const filtered = allSubs
          .filter((sub) => {
            // Convertir la string ISO en Date
            const dueDate = new Date(sub.dueDate);
            console.log("Date d'échéance pour", sub.serviceName, ":", dueDate);
            return dueDate >= currentDate && dueDate <= next30Days;
          })
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 3);

        console.log("Abonnements filtrés:", filtered);
        setSubscriptions(filtered);
      } catch (error) {
        console.error("Erreur complète:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSubscriptions(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-8 ml-5 lg:mx-10">
        <div className="xl:w-1/2 p-5 lg:py-10 bg-n-7 rounded-xl h-[500px] flex items-center justify-center">
          <p>Chargement des données...</p>
        </div>
        <div className="xl:w-1/2 flex flex-col p-5 items-center justify-center lg:p-10 bg-n-7 rounded-xl h-[500px]">
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4 lg:gap-8 ml-5 lg:mx-10">
      <div className="xl:w-1/2">
        <Graphic />
      </div>
      <div className="xl:w-1/2 flex flex-col p-5 lg:p-10 bg-n-7 rounded-xl h-[500px]">
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
                    <span className="h5">{subscription.cost.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-2 text-n-3">
                      {`Échéance : ${new Date(subscription.dueDate).toLocaleDateString()}`}
                    </span>
                    <span
                      className={`body-2 ${
                        subscription.isActive ? "text-green-500" : "text-orange-500"
                      }`}
                    >
                      {subscription.isActive ? "Actif" : "Inactif"}
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
