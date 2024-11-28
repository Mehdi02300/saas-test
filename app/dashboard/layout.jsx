import Container from "@/components/Container";
import SideBar from "@/components/dashboard/SideBar";

export default function dashboardLayout({ children }) {
  return (
    <Container className={"flex"}>
      <div>
        <SideBar />
      </div>
      <div className="ml-8 lg:ml-60 w-full overflow-hidden">{children}</div>
    </Container>
  );
}
