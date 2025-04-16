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


import { type PharmacySchema } from "@/lib/zod";
import { IPharmacy } from "@/interfaces/pharmacy";
import PharmacyForm from "./pharmacy-form";
import { ViewIcon } from "lucide-react";

export default function ViewPharmacy({ pharmacy }: { pharmacy: IPharmacy }) {
    const [isDialogOpen, setDialogOpen] = useState(false);    

    const onSubmit = async (data: PharmacySchema) => {
        console.log(data);                
        setDialogOpen(false);
        mutate("/api/pharmacys");
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
            <DialogContent className="sm:max-w-[520px] bg-white">
                <DialogHeader>
                    <DialogTitle>View Pharmacy</DialogTitle>
                </DialogHeader>
                
                <PharmacyForm
                    defaultValues={{  
                        order: pharmacy.order || "",                    
                        idPatient: pharmacy.idPatient || "",
                        address: pharmacy.address || "",
                        pharmacyDetails: pharmacy.pharmacyDetails || "",
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
