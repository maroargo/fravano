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

import { roleSchema, type RoleSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import RoleForm from "./role-form";
import { useToast } from "@/hooks/use-toast";

export default function CreateRole() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);  
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: ""
    },
  });

  const onSubmit = async (data: RoleSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create role"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/roles");
      setErrorMessage("");

      toast({
        title: "Success",
        description: "Role created.",
      })
    } catch (error) {
      console.error("Error creating role:", error);
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
        <Button>Add Role</Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <RoleForm
          defaultValues={{            
            name: "",
            idStatus: "0",
            accessRoles: []
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
