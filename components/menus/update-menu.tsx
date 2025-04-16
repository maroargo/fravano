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

import MenuForm from "@/components/menus/menu-form";
import { type MenuSchema } from "@/lib/zod";
import { Menu } from "@prisma/client";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

export default function UpdateMenu({ menu }: { menu: Menu }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: MenuSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/menus", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: menu.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Failed to update menu"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/menus");

            toast({
              title: "Success",
              description: "Menu updated.",
            })
        } catch (error) {
            console.error("Error updating menu:", error);
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
                    <DialogTitle>Update Menu</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <MenuForm
                    defaultValues={{
                        name: menu.name || "",
                        url: menu.url || "",
                        icon: menu.icon || "",
                        idMenu: menu.idMenu || ""
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Update"
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
