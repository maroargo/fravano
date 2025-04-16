import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Toaster } from "@/components/ui/toaster"
import { auth } from "@/auth";
import { IRolNav, IUserNav } from "@/interfaces/session";

export default async function Layout({ children } : Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    const userNav: IUserNav = {          
        name: session?.user.name || "",          
        email: session?.user.email || "" 
    } 
    
    const rolNav: IRolNav = {          
        name: session?.user.role?.name || "",                  
        plan: session?.user.organization?.name || "",  
        logo: session?.user.organization?.logo || ""
    } 

    return (
        <SidebarProvider>
        <AppSidebar user={userNav} role={rolNav} />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />                    
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <main className="flex-1 p-4 bg-[#F4F5F9] overflow-auto">
                    { children }
                    <Toaster />
                </main>
            </div>
        </SidebarInset>
        </SidebarProvider>                      
    )
}