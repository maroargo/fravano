"use client";

import { useState } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


import { type MaintenanceSchema } from "@/lib/zod";
import { IMaintenance } from "@/interfaces/maintenance";
import MaintenanceForm from "./maintenance-form";
import { ViewIcon } from "lucide-react";

export default function ViewMaintenance({ maintenance }: { maintenance: IMaintenance }) {
    const [isDialogOpen, setDialogOpen] = useState(false);    

    const onSubmit = async (data: MaintenanceSchema) => {                       
        setDialogOpen(false);
        mutate("/api/maintenances");
    };

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
            <DialogContent className="sm:max-w-[625px] bg-white">
                <DialogHeader>
                    <DialogTitle>View Maintenance</DialogTitle>
                </DialogHeader>
                
                <MaintenanceForm
                    defaultValues={{  
                        idVehicle: maintenance.idVehicle || "",                     
                        description: maintenance.description || "",                        
                        maintenanceDetails: maintenance.maintenanceDetails || "",
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Close"
                    isSubmitting={false}
                    isDisabled={true}
                />
            </DialogContent>
        </Dialog>
    );
}
