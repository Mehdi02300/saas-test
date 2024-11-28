import { default as SubscriptionCard } from "./SubscriptionCard";

const SubscriptionGrid = ({ subscriptions, onSubscriptionDelete }) => {
  if (subscriptions.length === 0) {
    return <p className="text-center text-n-3 mt-8">Aucun abonnement trouvé.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onDelete={onSubscriptionDelete}
        />
      ))}
    </div>
  );
};

export default SubscriptionGrid;
