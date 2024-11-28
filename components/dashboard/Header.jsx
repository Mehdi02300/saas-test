"use client";
import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import Button from "../Button";
import AddSub from "../subscriptions/AddSub";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center pl-5 lg:px-10">
      <h1 className="h2">Tableau de bord</h1>

      <Button
        theme="primary"
        className="flex flex-col md:flex-row items-center justify-center gap-1 lg:gap-3"
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
  );
};

export default Header;
