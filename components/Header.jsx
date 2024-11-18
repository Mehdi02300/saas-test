import { HandCoins } from "lucide-react";
import Container from "./Container";
import Button from "./Button";
import Tache from "./theme/Header";
import Link from "next/link";

const Header = () => {
  return (
    <div className="relative border-b border-stroke-1">
      <Container className={"bg-n-9 relative"}>
        <div className="z-10 flex justify-between items-center py-4 lg:py-6">
          <div className="flex items-center gap-2">
            <HandCoins className="h-8 w-8 text-p-3" />
            <span className="text-2xl text-white pointer-events-none z-10">SubTrack</span>
          </div>
          <div className="flex gap-2 lg:gap-5">
            <Link href={"/login"}>
              <Button theme="secondary">Se connecter</Button>
            </Link>
            <Link href={"/signup"}>
              <Button theme="primary">S'inscrire</Button>
            </Link>
          </div>
        </div>
        <Tache className={"-top-40 -left-40"} />
      </Container>
    </div>
  );
};

export default Header;
