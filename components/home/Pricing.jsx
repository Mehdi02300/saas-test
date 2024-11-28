import React from "react";
import { CheckCircle } from "lucide-react";
import Container from "../Container";
import Button from "../Button";
import Heading from "./Heading";

const Pricing = () => {
  return (
    <div className="lg:my-28">
      <Heading title="SubTrack" subtitle="Choisissez le forfait qui correspond à vos besoins" />
      <Container>
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-10 lg:mb-16">
          {pricing.map((price, index) => (
            <div
              key={index}
              className="relative bg-n-7 rounded-xl lg:rounded-2xl p-6 h-[470px] lg:h-[600px] lg:p-12 text-center lg:text-start"
            >
              <div className="text-caption-1 text-n-5 uppercase">{price.plan}</div>
              <div className="space-y-3">
                <span className="h1">{price.price}</span> <span className="text-n-3">/mois</span>
              </div>
              <hr className="border-t border-n-6 mt-7 mb-4 lg:mt-16 lg:mb-8" />
              <div className="space-y-4 pb-8">
                {price.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center lg:justify-start gap-3"
                  >
                    <CheckCircle className="text-n-3" />
                    <div className="body-2 text-n-3">{feature}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <Button theme="primary" className={"absolute bottom-6"}>
                  Acheter ce plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

const pricing = [
  {
    plan: "Personnel",
    price: "5€",
    description: "Parfait pour les particuliers gérant leurs abonnements personnels.",
    features: [
      "Jusqu'à 20 abonnements",
      "Analyses de base",
      "Notifications par email",
      "Support technique",
    ],
  },
  {
    plan: "Professionnel",
    price: "19€",
    description: "Idéal pour les freelances et petites entreprises.",
    features: [
      "Abonnements illimités",
      "Analyses avancées",
      "Notifications par email",
      "Support technique",
      "Catégories personnalisées",
    ],
  },
  {
    plan: "Entreprise",
    price: "99€",
    description: "Pour les grandes organisations aux besoins complexes.",
    features: [
      "Abonnements illimités",
      "Analyses avancées",
      "Notifications par email",
      "Support technique",
      "Catégories personnalisées",
      "Intégrations sur mesure",
      "Accès API",
    ],
  },
];

export default Pricing;
