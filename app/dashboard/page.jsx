import BigCard from "@/components/dashboard/BigCard";
import Header from "@/components/dashboard/Header";
import LittleCard from "@/components/dashboard/LittleCard";

export default async function DashboardPage() {
  return (
    <div>
      <Header />
      <LittleCard />
      <BigCard />
    </div>
  );
}
