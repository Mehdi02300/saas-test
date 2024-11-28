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
        const q = query(
          collection(db, "subscriptions"),
          where("userId", "==", user.uid),
          orderBy("dueDate", "asc")
        );

        const querySnapshot = await getDocs(q);
        const allSubs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter for next 30 days subscriptions
        const currentDate = new Date();
        const next30Days = new Date(currentDate);
        next30Days.setDate(next30Days.getDate() + 30);

        const filtered = allSubs
          .filter((sub) => {
            const dueDate = new Date(sub.dueDate);
            return dueDate >= currentDate && dueDate <= next30Days;
          })
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 3);

        setSubscriptions(filtered);
      } catch {
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchSubscriptions(user);
      else setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-8 ml-5 lg:mx-10">
        <div className="xl:w-1/2 p-5 lg:py-10 bg-n-7 rounded-xl h-[400px] flex items-center justify-center">
          <p>Chargement des données...</p>
        </div>
        <div className="xl:w-1/2 flex flex-col p-5 items-center justify-center lg:p-10 bg-n-7 rounded-xl h-[350px] md:h-[400px]">
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
      <div className="xl:w-1/2 flex flex-col items-center justify-start p-5 bg-n-7 rounded-xl h-[350px] md:h-[400px]">
        <div className="flex flex-col pt-0">
          <h2 className="h4 mb-4">Prochains renouvellements</h2>
        </div>
        <div className="flex flex-col justify-between gap-3 w-full">
          {subscriptions.length === 0 ? (
            <p className="lg:mt-5 text-center">Aucun abonnement à renouveler à venir.</p>
          ) : (
            subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-n-9 rounded-xl p-5">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="h5">{subscription.serviceName}</span>
                    <span className="h5">{subscription.cost.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-2 text-sm text-n-3">
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
