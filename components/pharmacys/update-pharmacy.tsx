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
import { Pencil1Icon } from "@radix-ui/react-icons";
import { IPharmacy } from "@/interfaces/pharmacy";
import PharmacyForm from "./pharmacy-form";

export default function UpdatePharmacy({ pharmacy }: { pharmacy: IPharmacy }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdated, setIsUpdated] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const onSubmit = async (data: PharmacySchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/pharmacys", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: pharmacy.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Failed to update pharmacy"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/pharmacys");
        } catch (error) {
            console.error("Error updating pharmacy:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred";
            setErrorMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200">
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] bg-white">
                <DialogHeader>
                    <DialogTitle>Update Pharmacy</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <PharmacyForm
                    defaultValues={{  
                        order: pharmacy.order || "",                      
                        idPatient: pharmacy.idPatient || "",
                        address: pharmacy.address || "",
                        dateOrder: pharmacy.dateOrder,
                        dateDelivery: pharmacy.dateDelivery,
                        copay: pharmacy.copay || "",
                        pharmacyDetails: pharmacy.pharmacyDetails || "",
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Update"
                    isSubmitting={isSubmitting}
                    isUpdated={isUpdated}
                />
            </DialogContent>
        </Dialog>
    );
}
