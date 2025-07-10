import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>

            <DashboardSidebar/> {/*This is here cause we want this sidebar to be in all dashboard routes  */}

            <main className="flex flex-col h-screen w-screen bg-muted">
                {children}
            </main>

        </SidebarProvider>
    )
}

export default Layout;