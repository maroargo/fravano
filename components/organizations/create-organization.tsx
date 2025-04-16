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

import { organizationSchema, type OrganizationSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import OrganizationForm from "./organization-form";
import { useToast } from "@/hooks/use-toast";

export default function CreateOrganization() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<OrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      idStatus: "0"
    },
  });

  const onSubmit = async (data: OrganizationSchema) => {
    setIsSubmitting(true);
    try {      
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create organización"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/organizations");
      setErrorMessage("");

      toast({
        title: "Success",
        description: "Organization created.",
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
        <Button>Add Organization</Button>
      </DialogTrigger>      
      
      <DialogContent className="sm:max-w-[425px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Create new organization</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <OrganizationForm
          defaultValues={{
            name: "",
            email: "",
            address: "", 
            idStatus: "0",
            logo: "", 
            idTimezone: "",
            idTimeformat: ""                       
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
