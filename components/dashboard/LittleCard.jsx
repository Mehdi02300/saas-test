import { CreditCardIcon, EuroIcon } from "lucide-react";

const LittleCard = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 m-5 lg:m-10">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex lg:flex-1 flex-col bg-n-7 rounded-xl gap-3 lg:gap-5 p-5 lg:p-7"
        >
          <div className="flex justify-between items-center">
            <span className="h6">{card.title}</span>
            <span className="text-n-3">{card.icon}</span>
          </div>
          <div className="h3">{card.number}</div>
          <div className="body-3 text-n-3">{card.description}</div>
        </div>
      ))}
    </div>
  );
};

const cards = [
  {
    title: "Dépenses mensuelles",
    icon: <EuroIcon />,
    number: "580,97 €",
    description: "+4.1% par rapport au dernier mois",
  },
  {
    title: "Abonnement actifs",
    icon: <CreditCardIcon />,
    number: "12",
    description: "2 renouvellements à venir",
  },
  {
    title: "Economies potentielles",
    icon: <EuroIcon />,
    number: "124,50 €",
    description: "3 suggestions d'optimisation",
  },
];

export default LittleCard;
