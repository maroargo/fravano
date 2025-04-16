"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { employeeSchema, type EmployeeSchema } from "@/lib/zod";
import { useState } from "react";
import useSWR from "swr";

import { mutate } from "swr";
import EmployeeForm from "./employee-form";
import { useToast } from "@/hooks/use-toast";
import { Employee, OrganizationParams } from "@prisma/client";
import { IOrganization } from "@/interfaces/organization";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateEmployee() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",      
      identifier: "",
      email: "",      
      phone: "",
      idLocation: "",
      idMode: "",
      clockIn: "",      
      clockOut: "",
      idStatus: "0"         
    },
  });

  const { data: identifierParam } = useSWR<OrganizationParams>("/api/organizationsParam", fetcher); 
  const { data: employees } = useSWR<Employee[]>("/api/employees", fetcher);
  const employeeList = employees || [];

  const onSubmit = async (data: EmployeeSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create employee"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/employees");
      setErrorMessage("");

      toast({
        title: "Success",
        description: "Employee created.",
      })
    } catch (error) {      
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Employee</Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <EmployeeForm
          defaultValues={{
            firstName: "",
            lastName: "",
            identifier: (parseInt(identifierParam?.identifier ?? "1000") + employeeList.length + 1) + "",            
            email: "",            
            phone: "",
            idLocation: "",
            idMode: "",
            clockIn: "",      
            clockOut: "",
            idStatus: "0",
          }}
          onSubmit={onSubmit}
          submitButtonText="Create"
          isSubmitting={isSubmitting}
          isUpdating={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}
