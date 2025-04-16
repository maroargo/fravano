'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { addressSchema, type AddressSchema } from '@/lib/zod';
import { useState } from 'react';

import { mutate } from 'swr';
import AddressForm from './address-form';
import AddresMap from './address-map';

export default function CreateAddress() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number }>(null!);

  const form = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      address: '',
      idAddressType: '',
      idOrganization: '',
    },
  });

  const onSubmit = async (data: AddressSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create address');
      }
      form.reset();
      setDialogOpen(false);
      mutate('/api/address');
      setErrorMessage('');
    } catch (error) {
      console.error('Error creating address:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Address</Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[80%] bg-white"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create New Address</DialogTitle>
        </DialogHeader>
        {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

        <div className={'grid gap-4 grid-cols-2'}>
          <div>
            <AddressForm
              defaultValues={{
                name: '',
                address: '',
                idAddressType: '',
                idOrganization: '',
              }}
              onSubmit={onSubmit}
              submitButtonText="Create"
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
