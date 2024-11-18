import Features from "@/components/Features";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CallToAction from "@/components/CallToAction";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Header />
      <Hero />
      <Features />
      <CallToAction />
      <Pricing />
      <Footer />
    </div>
  );
}
