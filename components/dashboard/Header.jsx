import { PlusIcon } from "lucide-react";
import Button from "../Button";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-5 lg:px-10">
      <div className="h2">Tableau de bord</div>
      <Button theme="primary" className={"flex gap-1 lg: gap:3"}>
        <PlusIcon /> Nouvel abonnement
      </Button>
    </div>
  );
};

export default Header;
