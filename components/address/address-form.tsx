'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

import { addressSchema, type AddressSchema } from '@/lib/zod';

import { AddressType, Organization } from '@prisma/client';
import useSWR from 'swr';
import { PlaceAutocomplete } from '../ui/place-autocomplete';
import { useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface AddressFormProps {
  defaultValues: AddressSchema;
  onSubmit: (data: AddressSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  setLocation: (position: { lng: number; lat: number }) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AddressForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  setLocation,
}: AddressFormProps) {
  const form = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const { data: organizations } = useSWR<Organization[]>('/api/organizations', fetcher);

  const { data: addressTypes } = useSWR<AddressType[]>('/api/addressTypes', fetcher);

  const organizationList = organizations || [];
  const addressTypeList = addressTypes || []; 
    
  useEffect(() => {
    
  }, []);  

  const handlePlaceSelect = useCallback(
    async (place: google.maps.places.PlaceResult, onChange: (value: string) => void) => {
      if (place?.geometry?.location) {
        const location = place.geometry.location;

        onChange(place.formatted_address || '');

        const currentLat = location.lat();
        const currentLng = location.lng();

        form.setValue("lat", currentLat);
        form.setValue("lng", currentLng);

        if (currentLat !== undefined && currentLng !== undefined) {
          try {
            setLocation({ lat: currentLat, lng: currentLng });
          } catch (error) {
            console.log(error);
            toast({
              title: 'Error',
              description: 'The route does not exist',
            });
          }
        } else {
          toast({
            title: 'Error',
            description: 'Invalid lat/lng value',
          });
        }
      }
    },
    [
      /*fields, update*/
    ] // Include fields as dependency
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={false}
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <PlaceAutocomplete
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e.target.value);
                  }}
                  disabled={false}
                  placeholder={'Address'}
                  value={field.value}
                  onPlaceSelect={(place) => {
                    if (place) {
                      handlePlaceSelect(place, field.onChange);
                    }
                  }}
                  className="z-[100001]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idAddressType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Address Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {addressTypeList.map((addressType) => (
                    <FormItem
                      className="flex items-center space-x-3 space-y-0"
                      key={addressType.id}
                    >
                      <FormControl>
                        <RadioGroupItem value={addressType.id} />
                      </FormControl>
                      <FormLabel className="font-normal">{addressType.name}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idOrganization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a organization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {organizationList.map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isSubmitting} className="w-full relative" type="submit">
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-md">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
