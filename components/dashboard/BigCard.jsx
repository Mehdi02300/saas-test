import Graphic from "./Graphic";

const BigCard = () => {
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
          {cards.map((card, index) => (
            <div key={index} className="bg-n-9 rounded-xl p-5 mt-5">
              <div className="flex flex-col justify-between">
                <div className="flex justify-between">
                  <span className="h5">{card.title}</span>
                  <span className="h5">{card.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-2 text-n-3">{card.date}</span>
                  <span
                    className={`body-2 ${
                      card.status === "Actif" ? "text-green-500" : "text-orange-500"
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const cards = [
  {
    title: "Netflix",
    number: "17,99 €",
    date: "Échéance : 28/11/2024",
    status: "Actif",
  },
  {
    title: "Spotify",
    number: "9,99 €",
    date: "Échéance : 20/11/2024",
    status: "Actif",
  },
  {
    title: "Salle de sport",
    number: "29,99 €",
    date: "Échéance : 15/11/2024",
    status: "À renouveler",
  },
];

export default BigCard;
