import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext' // có
import { Outlet } from 'react-router'
import Header from './Header' // có
import Backdrop from './Backdrop' // có
import Sidebar from './Sidebar'

function LayoutContent() {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar()
    return (
        <div className="min-h-screen xl:flex">
            <div>
                <Sidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
                } ${isMobileOpen ? 'ml-0' : ''}`}
            >
                <Header />
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

function Index() {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    )
}

export default Index
