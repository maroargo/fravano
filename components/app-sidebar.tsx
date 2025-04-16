"use client"

import * as React from "react"
import { NavMain } from "./nav-main"

import {
  BadgeCheck,
  Bolt,  
  Building2,  
  Car,  
  ChartArea,   
  HandCoins,   
  House,  
  Logs,  
  MapPinHouse,   
  PictureInPicture,   
  Pill,   
  Route,   
  SquareDashedKanban,  
  SquareUser,  
  SquareUserRound,  
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
import { IRolNav, IUserNav } from "@/interfaces/session";

const data = {  
  navMain: [ 
    {
      title: "Overview",      
      icon: SquareDashedKanban,
      isActive: true,
      url: "/home",      
    },      
    {
      title: "Organizations",      
      icon: Building2,   
      isActive: true,   
      url: "/organizations",      
    },      
    {
      title: "Users",      
      icon: Users,  
      isActive: true,    
      url: "/users",      
    },    
    {
      title: "Address",      
      icon: MapPinHouse,
      isActive: true,
      url: "/address",      
    },    
    {
      title: "Drivers",      
      icon: SquareUser,
      isActive: true,
      url: "/drivers",      
    },    
    {
      title: "Vehicles",      
      icon: Car,
      isActive: true,
      url: "/vehicles",      
    },    
    {
      title: "Vehicles Check",      
      icon: BadgeCheck,
      isActive: true,
      url: "/vehicles-check",      
    },            
    {
      title: "Routes",      
      icon: Route,
      isActive: true,
      url: "/route",      
    },
    {
      title: "Dispatch",
      icon: PictureInPicture,
      isActive: true,
      url: "/dispatch",      
    },
    {
      title: "Analytic",      
      icon: ChartArea,
      isActive: true,
      url: "/analytic",       
    },
    {
      title: "Patients",      
      icon: SquareUserRound,
      isActive: true,
      url: "/patient",       
    },
    {
      title: "Pharmacy Orders",      
      icon: Pill,
      isActive: true,
      url: "/pharmacy",       
    }
    /*{
      title: "Map Location",
      icon: PictureInPicture,
      url: "/maplocation",      
    },
    {
      title: "Map Autocomplete",
      icon: PictureInPicture,
      url: "/mapautocomplete",      
    },
    {
      title: "Map Distance",
      icon: PictureInPicture,
      url: "/mapdistance",      
    }*/
  ],

  navMainMan: [ 
    {
      title: "Roles",      
      icon: HandCoins,
      isActive: true,
      url: "/roles",       
    },
    {
      title: "Menus",      
      icon: Logs,
      isActive: true,
      url: "/menus",       
    },    
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
        <NavMain items={data.navMain} itemsMan={data.navMainMan} />              
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
