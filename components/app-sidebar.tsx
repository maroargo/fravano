"use client"

import * as React from "react"
import { NavMain } from "./nav-main"

import {
  CalendarClock,
  Clock10,   
  House,       
  MapPinHouse,       
  NotebookPen,       
  School,       
  UserRound,       
  Users,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { RolSwitcher } from "@/components/rol-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { IRolNav, IUserNav } from "@/interfaces/session"

const data = {
  navMain: [
    {
      title: "Dashboard",      
      icon: House,
      isActive: true,
      url: "/home",       
    },   
    {
      title: "Organization",      
      icon: School,
      isActive: true,
      url: "/organizations",      
    }, 
    {
      title: "Users",      
      icon: UserRound,
      isActive: true,
      url: "/users",      
    },    
    {
      title: "Locations",      
      icon: MapPinHouse,
      isActive: true,
      url: "/locations",      
    },                
    {
      title: "Employees",      
      icon: Users,
      isActive: true,
      url: "/employee",      
    },        
    {
      title: "Attendances",      
      icon: CalendarClock,
      isActive: true,
      url: "/attendance",      
    },        
    {
      title: "Compliance",      
      icon: NotebookPen,
      isActive: true,
      url: "/compliance",      
    }   
  ]  
}

export function AppSidebar({
  user, role
}: {
  user : IUserNav;
  role : IRolNav;
}) {
    
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <RolSwitcher role={role} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />              
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
