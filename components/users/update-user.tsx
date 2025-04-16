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

import UserUpdateForm from "@/components/users/user-update-form";
import { type UserUpdateSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { IUser } from "@/interfaces/user";
import { Status } from "@prisma/client";

export default function UpdateUser({ user }: { user: IUser }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const onSubmit = async (data: UserUpdateSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: user.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Failed to update user"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/users");
        } catch (error) {
            console.error("Error updating user:", error);
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
                    <DialogTitle>Update User</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <UserUpdateForm
                    defaultValues={{
                        name: user.name || "",
                        email: user.email || "",
                        phone: user.phone || "",                        
                        idOrganization: user.idOrganization || "",
                        idRole: user.idRole || "",
                        idStatus: user.status == Status.active ? "0" : "1"
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Update"
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
