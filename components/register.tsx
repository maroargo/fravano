"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/lib/zod";

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

import { registerAction } from "@/actions/auth-action";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

function FormRegister() {
  const [errorForm, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();  

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await registerAction(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/home");
      }
    });
  }
    
  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
        <div className="bg-white w-full max-w-md shadow-lg rounded-lg p-8">          

          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              NEW REGISTER
            </h2>
            <p className="text-sm text-gray-500">Please enter your details</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />                      
              
              {errorForm && <FormMessage>{errorForm}</FormMessage>}
              <Button
                className=" w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 focus:ring focus:ring-primary transition-colors duration-300 ease-in-out"
                type="submit"
                disabled={isPending}
              >
                REGISTER
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default FormRegister;
