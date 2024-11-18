import Container from "@/components/Container";
import BigCard from "@/components/dashboard/BigCard";
import Header from "@/components/dashboard/Header";
import LittleCard from "@/components/dashboard/LittleCard";
import SideBar from "@/components/dashboard/SideBar";

export default function page() {
  return (
    <Container className={"flex"}>
      <div>
        <SideBar />
      </div>
      <div className="flex-1">
        <Header />
        <LittleCard />
        <BigCard />
      </div>
    </Container>
  );
}
