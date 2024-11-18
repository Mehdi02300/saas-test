import { FacebookIcon, Instagram, InstagramIcon, LinkedinIcon, X, XIcon } from "lucide-react";
import Container from "./Container";

const Footer = () => {
  return (
    <div className="bg-n-7 py-5 lg:py-12 mt-5 lg:mt-28">
      <Container
        className={
          "flex flex-col gap-3 lg:flex-row lg:gap-1 items-center justify-between body-3 text-n-3"
        }
      >
        <div className="flex lg:flex-col gap-2 lg:gap-6">
          <a href="#/" target="_blank" rel="noreferrer" className="flex items-center gap-1">
            <InstagramIcon />
            <span className="hidden lg:block">Instagram</span>
          </a>
          <a href="#/" target="_blank" rel="noreferrer" className="flex items-center gap-1">
            <LinkedinIcon />
            <span className="hidden lg:block">LinkedIn</span>
          </a>
          <a href="#/" target="_blank" rel="noreferrer" className="flex items-center gap-1">
            <FacebookIcon />
            <span className="hidden lg:block">Facebook</span>
          </a>
        </div>
        <div className="space-x-4">
          <a href="#/" target="_blank" rel="noreferrer">
            Termes et conditions
          </a>
          <a href="#/" target="_blank" rel="noreferrer">
            Privacy Polity
          </a>
        </div>
        <div>
          &copy; 2024 Tous droits réservés{" "}
          <a href="#/" target="_blank" rel="noreferrer">
            SubTrack
          </a>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
