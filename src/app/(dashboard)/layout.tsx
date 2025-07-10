import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>

            <DashboardSidebar/> {/*This is here cause we want this sidebar to be in all dashboard routes  */}

            <main className="flex flex-col h-screen w-screen bg-muted">
                <DashboardNavbar/>{/*This is here cause we want this navbar to be in all dashboard routes  */}
                {children}
            </main>

        </SidebarProvider>
    )
}

export default Layout;