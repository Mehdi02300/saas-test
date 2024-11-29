"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import FilterBar from "@/components/dashboard/subscriptions/FilterBar";
import SubscriptionGrid from "@/components/dashboard/subscriptions/SubscriptionGrid";
import Button from "@/components/Button";
import { PlusIcon } from "lucide-react";
import AddSub from "@/components/subscriptions/AddSub";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "active", "inactive"
  const [sortBy, setSortBy] = useState("dueDate"); // "dueDate", "name", "cost"
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscriptionDelete = (deletedId) => {
    setSubscriptions((current) => current.filter((sub) => sub.id !== deletedId));
  };

  useEffect(() => {
    const fetchSubscriptions = async (user) => {
      try {
        const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        const subs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubscriptions(subs);
      } catch (error) {
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

  const filteredSubscriptions = subscriptions
    .filter((sub) => {
      if (filter === "active") return sub.isActive;
      if (filter === "inactive") return !sub.isActive;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.serviceName.localeCompare(b.serviceName);
        case "cost":
          return b.cost - a.cost;
        default: // "dueDate"
          return new Date(a.dueDate) - new Date(b.dueDate);
      }
    });

  if (loading) {
    return (
      <div className="p-5 lg:p-10">
        <p>Chargement des abonnements...</p>
      </div>
    );
  }

  return (
    <div className="px-5 lg:px-10">
      <div className="flex justify-between gap-1 items-center mb-5">
        <h1 className="h2">Mes Abonnements</h1>

        <Button
          theme="primary"
          className="text-xs flex flex-col md:flex-row items-center justify-center gap-1 lg:gap-3"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon /> Nouvel abonnement
        </Button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ajouter un abonnement</h2>
              <AddSub />
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
      <FilterBar filter={filter} setFilter={setFilter} sortBy={sortBy} setSortBy={setSortBy} />
      <SubscriptionGrid
        subscriptions={filteredSubscriptions}
        onSubscriptionDelete={handleSubscriptionDelete}
      />
    </div>
  );
};

export default SubscriptionsPage;
