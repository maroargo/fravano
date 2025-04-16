"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import RouteMap from "./route-map";
import { useState } from "react";

import { ViewIcon } from "lucide-react";
import { IRoute } from "@/interfaces/route";

export default function ViewRoute({ route }: { route: IRoute }) { 
  const [isDialogOpen, setDialogOpen] = useState(false);
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
            variant="ghost"
            size="icon"
            className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200">
            <ViewIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[725px] bg-white">
        <DialogHeader>
          <DialogTitle>View Routes</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <RouteMap fields={route.routeDetails} />
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
