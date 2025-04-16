"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";

export default function DeleteRole({ id }: { id: string }) {
    const { toast } = useToast();

    const handleDelete = async () => {
        const response = await fetch(`/api/roles?id=${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            console.log("Role deleted successfully");
            mutate("/api/roles");

            toast({
              title: "Success",
              description: "Role deleted.",
            })
        } else {
            console.error("Failed to delete role");
        }
    };

    return (
        <Button
            onClick={handleDelete}
            variant="ghost"
            size="icon"
            className="mr-1 text-red-500 bg-red-100 hover:text-red-700 hover:bg-red-200"
        >
            <TrashIcon className="h-4 w-4" />
        </Button>
    );
}
