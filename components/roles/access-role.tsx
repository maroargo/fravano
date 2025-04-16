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

import { type RoleSchema } from "@/lib/zod";
import { GearIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { IRole } from "@/interfaces/role";
import AccessRoleForm from "./access-role-form";

export default function AccessRole({ role }: { role: IRole }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: RoleSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/accessroles", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: role.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Failed to update role"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/roles");

            toast({
              title: "Success",
              description: "Access Role updated.",
            })
        } catch (error) {
            console.error("Error updating role:", error);
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
            <DialogContent className="sm:max-w-[925px] bg-white">
                <DialogHeader>
                    <DialogTitle>Access Role</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <AccessRoleForm
                    idRole={role.id}
                    defaultValues={{                        
                        name: role.name || "",
                        accessRoles: role.accessRoles || []
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Update"
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
