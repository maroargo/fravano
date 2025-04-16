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

import DriverForm from "@/components/drivers/driver-form";
import { type DriverSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { IDriver } from "@/interfaces/driver";

export default function UpdateDriver({ driver }: { driver: IDriver }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const onSubmit = async (data: DriverSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/drivers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: driver.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Failed to update driver"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/drivers");
        } catch (error) {
            console.error("Error updating driver:", error);
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
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Update Driver</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <DriverForm
                    defaultValues={{
                        licensePlate: driver.licensePlate || "",
                        vinNumber: driver.vinNumber || "",
                        licenseNumber: driver.licenseNumber || "",
                        idLicenseState: driver.idLicenseState || "",
                        dateExpiredLicense: driver.dateExpiredLicense || "",
                        idUser: driver.idUser || ""
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Update"
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
