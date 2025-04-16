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

import AddressForm from "@/components/address/address-form";
import { type AddressSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { IAddress } from "@/interfaces/address";
import AddresMap from "./address-map";

export default function UpdateAddress({ address }: { address: IAddress }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number }>(null!);

  const onSubmit = async (data: AddressSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: address.id }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update address");
      }

      setErrorMessage("");
      setDialogOpen(false);
      mutate("/api/address");
    } catch (error) {
      console.error("Error updating address:", error);
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
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
        >
          <Pencil1Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[80%] bg-white"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Update Address</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <div className={"grid gap-4 grid-cols-2"}>
          <div>
            <AddressForm
              defaultValues={{
                name: address.name || "",
                address: address.address || "",
                idAddressType: address.idAddressType || "",
                idOrganization: address.idOrganization || "",
                lat: address.lat,
                lng: address.lng,
              }}
              onSubmit={onSubmit}
              submitButtonText="Update"
              isSubmitting={isSubmitting}
              setLocation={(pos: { lng: number; lat: number }) => setPosition(pos)}
            />
          </div>
          <div>
            <AddresMap position={position} />
          </div>
        </div>        
      </DialogContent>
    </Dialog>
  );
}
