import Header from "@/components/home/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/home/Pricing";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import CallToAction from "@/components/home/CallToAction";

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
