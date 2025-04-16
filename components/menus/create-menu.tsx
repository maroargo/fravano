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

import { menuSchema, type MenuSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import MenuForm from "./menu-form";

export default function CreateMenu() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const form = useForm<MenuSchema>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: ""
    },
  });

  const onSubmit = async (data: MenuSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create menu"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/menus");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating menu:", error);
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
        <Button>Add Menu</Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Menu</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <MenuForm
          defaultValues={{
            name: "",
            url: "",
            icon: "",
            idMenu: ""
          }}
          onSubmit={onSubmit}
          submitButtonText="Create"
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
