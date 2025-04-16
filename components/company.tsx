"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { companySchema } from "@/lib/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useSWR from "swr";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerCompanyAction } from "@/actions/auth-action";
import { useToast } from "@/hooks/use-toast";
import { Timeformat, Timezone } from "@prisma/client";

import { useDropzone } from "react-dropzone";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function FormCompany({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [errorForm, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      identifier: "",
    },
  });

  const { data: timezones } = useSWR<Timezone[]>("/api/timezones", fetcher);
  const { data: timeformats } = useSWR<Timeformat[]>(
    "/api/timeformats",
    fetcher
  );

  const timezoneList = timezones || [];
  const timeformatList = timeformats || [];

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = new FileReader();

    file.onload = async function () {
      setPreview(file.result);

      const formData = new FormData();

      formData.append("file", acceptedFiles[0]);
      formData.append("upload_preset", "MyHealthRide");
      formData.append("api_key", "545863275441586");

      const results = await fetch(
        "https://api.cloudinary.com/v1_1/drviydqd6/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());

      form.setValue("logo", results.url);
    };

    file.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
    });

  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  async function onSubmit(values: z.infer<typeof companySchema>) {
    setError(null);
    startTransition(async () => {
      const response = await registerCompanyAction(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/home");
        toast({
          title: "Success",
          description: "Your profile is completed.",
        });
      }
    });
  }

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center p-4">
        <div className="sm:max-w-[425px] bg-white shadow-lg rounded-lg p-8">
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              WELCOME TO FRAVANO!
            </h2>
            <p className="text-sm text-gray-500">
              Please complete your profile
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
            >
              <div className="flex flex-col items-center">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial User ID</FormLabel>
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

              <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="idTimezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Zone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time zone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timezoneList.map((timezone) => (
                            <SelectItem key={timezone.id} value={timezone.id}>
                              {timezone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idTimeformat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeformatList.map((timeformat) => (
                            <SelectItem
                              key={timeformat.id}
                              value={timeformat.id}
                            >
                              {timeformat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the file here ...</p>
                      ) : (
                        <p>
                          Drag 'n' drop file here, or click to select file
                        </p>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {preview && (
                <p className="mb-5">
                  <img src={preview as string} alt="Upload preview" />
                </p>
              )}

              {errorForm && <FormMessage>{errorForm}</FormMessage>}
              <Button
                className=" w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 focus:ring focus:ring-primary transition-colors duration-300 ease-in-out"
                type="submit"
                disabled={isPending}
              >
                START!
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default FormCompany;
