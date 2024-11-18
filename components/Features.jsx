import React from "react";
import Container from "./Container";
import { Bell, CreditCard, LineChart, Smartphone, Sparkles, Users } from "lucide-react";
import Tache from "./theme/Header";

const Features = () => {
  const features = [
    {
      icon: <CreditCard />,
      title: "Gestion Centralisée",
      description:
        "Suivez tous vos abonnements au même endroit avec synchronisation automatique et saisie manuelle.",
    },
    {
      icon: <Bell />,
      title: "Notifications Intelligentes",
      description: "Ne manquez plus jamais un renouvellement grâce aux alertes personnalisables.",
    },
    {
      icon: <LineChart />,
      title: "Analyse des Dépenses",
      description:
        "Visualisez vos habitudes de dépenses et identifiez les opportunités d'économies.",
    },
    {
      icon: <Sparkles />,
      title: "IA Intégrée",
      description: "Recevez des recommandations personnalisées pour optimiser vos coûts.",
    },
    {
      icon: <Users />,
      title: "Collaboration d'Équipe",
      description: "Gérez les abonnements en équipe avec des contrôles d'accès par rôle.",
    },
    {
      icon: <Smartphone />,
      title: "Accès Mobile",
      description: "Accédez à votre tableau de bord partout avec notre application mobile.",
    },
  ];

  return (
    <div>
      <Container>
        <div className="mt-20 lg:mt-28">
          <div className="space-y-4 mb-8 text-center lg:text-start">
            <h2 className="h2">Tout ce dont vous avez besoin pour gérer vos abonnements</h2>
            <p className="body-1 text-n-5">
              Des fonctionnalités puissantes pour reprendre le contrôle de vos dépenses récurrentes
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 lg:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border border-stroke-1 hover:bg-n-8 rounded-xl lg:rounded-2xl p-8 space-y-6 animate"
              >
                <div>{feature.icon}</div>
                <div className="space-y-2">
                  <h3 className="h4">{feature.title}</h3>
                  <p className="body-2 text-n-3">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Features;
