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

import { type OrganizationParamSchema } from "@/lib/zod";
import { GearIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { OrganizationParams } from "@prisma/client";
import OrganizationParamForm from "./params-form";

export default function UpdateParamOrganization({ organizationParam }: { organizationParam: OrganizationParams }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: OrganizationParamSchema) => {
        setIsSubmitting(true);
        try {            
            const response = await fetch("/api/organizationsParam", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: organizationParam ? organizationParam.id : "" }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "An unexpected error occurred"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/organizations");

            toast({
              title: "Success",
              description: "Organization param updated.",
            });
        } catch (error) {            
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
                    <GearIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Update organization params</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}

                <OrganizationParamForm
                    defaultValues={{
                        identifier: organizationParam ? (organizationParam.identifier || "") : "",
                        clockIn: organizationParam ? (organizationParam.clockIn || "") : "",
                        clockOut: organizationParam ? (organizationParam.clockOut || "") : "",
                        idPayPeriodType: organizationParam ? (organizationParam.clockOut || "") : "",
                        payPeriodStart: organizationParam ? (organizationParam.payPeriodStart || new Date) : new Date,                        
                        analyticTitle: organizationParam ? (organizationParam.analyticTitle || "") : "",
                        analyticSrc: organizationParam ? (organizationParam.analyticSrc || "") : ""                        
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Update"
                    isSubmitting={isSubmitting}
                    isUpdating={isUpdating}
                />
            </DialogContent>
        </Dialog>
    );
}
