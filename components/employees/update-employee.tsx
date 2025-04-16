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

import EmployeeForm from "@/components/employees/employee-form";
import { type EmployeeSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { IEmployee } from "@/interfaces/employee";
import { Status } from "@prisma/client";

export default function UpdateEmployee({ employee }: { employee: IEmployee }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: EmployeeSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/employees", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: employee.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Failed to update employee"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/employees");

            toast({
              title: "Success",
              description: "Employee updated.",
            });
        } catch (error) {
            console.error("Error updating employee:", error);
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
            <DialogContent className="sm:max-w-[625px] overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Update Employee</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <EmployeeForm
                    defaultValues={{
                        firstName: employee.firstName || "",                        
                        lastName: employee.lastName || "",
                        identifier: employee.identifier || "",
                        email: employee.email || "",
                        phone: employee.phone || "",   
                        clockIn: employee.clockIn || "",      
                        clockOut: employee.clockOut || "",
                        idLocation: employee.idLocation || "",
                        idMode: employee.idMode || "",
                        idStatus: employee.status == Status.active ? "0" : "1",                      
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
