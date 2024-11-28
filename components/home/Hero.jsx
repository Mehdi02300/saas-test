import Image from "next/image";
import Grid from "@/components/theme/Hero";
import Button from "../Button";
import Container from "../Container";
import Tache from "../theme/Header";

const Hero = () => {
  return (
    <div>
      <Container className="relative pt-10 lg:py-16 lg:mt-16 space-y-16">
        <div className="text-center px-16 mx-auto lg:px-0 space-y-7 lg:flex lg:gap-12 lg:justify-center lg:items-center">
          <div className="lg:flex-1 space-y-4 lg:space-y-7 ">
            <h1 className="hero lg:leading-none">
              <span className=" relative bg-clip-text text-transparent bg-gradient-to-b from-p-3 to-p-2">
                Maîtrisez
              </span>{" "}
              vos abonnements sans effort
            </h1>
            <p className="body-1 text-n-5">
              Prenez le contrôle de vos dépenses récurrentes avec SubTrack. Suivez, optimisez et
              gérez tous vos abonnements en un seul endroit. Parfait pour les particuliers comme
              pour les entreprises.
            </p>
            <Button theme={"primary"} href="/">
              Essai Gratuit
            </Button>
          </div>
          <Image
            src={"/assets/hero.avif"}
            width={400}
            height={400}
            alt="ilustration"
            className={"z-10 rounded-lg mx-auto w-full lg:w-1/2 h-full"}
          />
        </div>
        <Grid />
        <Tache className={"-bottom-80 -right-60 md:-right-80 lg:-right-[500px]"} />
      </Container>
    </div>
  );
};

export default Hero;
