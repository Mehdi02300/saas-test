import { ArrowBigRight } from "lucide-react";
import Button from "./Button";
import Container from "./Container";

const CallToAction = ({ minify = false }) => {
  return (
    <Container className={"lg:mt-28"}>
      <div className="py-5 lg:py-10">
        <div
          className={`rounded-xl lg:rounded-3xl bg-gradient-to-tl from-p-3 to-p-4 p-6 gap-8
            ${
              !minify
                ? "flex flex-col items-center lg:p-16"
                : "flex flex-col items-center justify-between lg:flex lg:flex-row lg:items-center lg:py-10 lg:px-16"
            }`}
        >
          <div className={minify ? "spacy-y-1 text-center lg:text-start" : "space-y-4 text-center"}>
            <div className="caption-1 text-n-1/50">Prêt à commencer ?</div>
            <h3 className="h3">Démarre ton essai gratuit aujourd'hui !</h3>
          </div>
          <Button theme="primary" className={"flex items-center justify-center gap-1"}>
            <span>Commencer</span>
            <ArrowBigRight />
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CallToAction;
