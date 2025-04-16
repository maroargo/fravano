"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  organizationParamSchema,
  type OrganizationParamSchema,
} from "@/lib/zod";
import { Label } from "../ui/label";
import { PayPeriodType } from "@prisma/client";
import useSWR from "swr";
import { DateTimePicker } from "../ui/datetimepicker";

interface OrganizationParamFormProps {
  defaultValues: OrganizationParamSchema;
  onSubmit: (data: OrganizationParamSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrganizationParamForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: OrganizationParamFormProps) {
  const form = useForm<OrganizationParamSchema>({
    resolver: zodResolver(organizationParamSchema),
    defaultValues,
  });

  const { data: payPeriodTypes } = useSWR<PayPeriodType[]>(
    "/api/payPeriodTypes",
    fetcher
  );
  const payPeriodTypeList = payPeriodTypes || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Label className="gap-4">Initial User ID</Label>
        <div className="flex flex-col items-center">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>                
                <FormControl>
                  <InputOTP maxLength={4} {...field}>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-4" />
        
        <Label className="gap-4">Working Hours</Label>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">          
          <FormField
            control={form.control}
            name="clockIn"
            render={({ field }) => (
              <FormItem>                
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clockOut"
            render={({ field }) => (
              <FormItem>                
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-4" />        

        <FormField
          control={form.control}
          name="idPayPeriodType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pay period type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {payPeriodTypeList.map((pay) => (
                    <SelectItem key={pay.id} value={pay.id}>
                      {pay.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="payPeriodStart"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pay Period Start</FormLabel>
              <FormControl>
                <DateTimePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isSubmitting}
          className="w-full relative"
          type="submit"
        >
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
