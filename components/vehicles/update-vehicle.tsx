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

import VehicleForm from "@/components/vehicles/vehicle-form";
import { type VehicleSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { IVehicle } from "@/interfaces/vehicle";

export default function UpdateVehicle({ vehicle }: { vehicle: IVehicle }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const onSubmit = async (data: VehicleSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/vehicles", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: vehicle.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Failed to update vehicle"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/vehicles");
        } catch (error) {
            console.error("Error updating vehicle:", error);
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
                    className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
                >
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] bg-white">
                <DialogHeader>
                    <DialogTitle>Update Vehicle</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <VehicleForm
                    defaultValues={{
                        name: vehicle.name || "",
                        label: vehicle.label || "",
                        make: vehicle.make || "",
                        model: vehicle.model || "",
                        year: vehicle.year || "",
                        licensePlate: vehicle.licensePlate || "",
                        idVehicleType: vehicle.idVehicleType || "",
                        idDriver: vehicle.idDriver || ""
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Update"
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
