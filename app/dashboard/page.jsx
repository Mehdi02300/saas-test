import Container from "@/components/Container";
import BigCard from "@/components/dashboard/BigCard";
import Header from "@/components/dashboard/Header";
import LittleCard from "@/components/dashboard/LittleCard";
import SideBar from "@/components/dashboard/SideBar";

export default async function DashboardPage() {
  return (
    <Container className={"flex"}>
      <div>
        <SideBar />
      </div>
      <div className="ml-8 lg:ml-60 w-full overflow-hidden">
        <Header />
        <LittleCard />
        <BigCard />
      </div>
    </Container>
  );
}
