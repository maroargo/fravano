"use client";

import useSWR from "swr";
import CameraVideo from "./cameraVideo.jsx";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/lib/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { registerAction } from "@/actions/auth-action";
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Organization, Location } from "@prisma/client";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function FormRegister() {
  const [errorForm, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [idLocacion, setIdLocation] = useState<string>("");

  const [time, setTime] = useState({
    hours:
      new Date().getHours() > 12
        ? new Date().getHours() - 12
        : new Date().getHours(),
    minutes: new Date().getMinutes(),
    seconds: new Date().getSeconds(),
    zone: new Date().getHours() >= 12 ? "PM" : "AM",
  });

  const [day, setDay] = useState({
    currDay: days[new Date().getDay()],
    currMonth: months[new Date().getMonth()],
    currDate: new Date().getDate(),
    currYear: new Date().getFullYear(),
  });

  const { toast } = useToast();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const state = { button: 1 };

  function updateTime() {
    setTime({
      hours:
        new Date().getHours() > 12
          ? new Date().getHours() - 12
          : new Date().getHours(),
      minutes: new Date().getMinutes(),
      seconds: new Date().getSeconds(),
      zone: new Date().getHours() >= 12 ? "PM" : "AM",
    });
  }

  function updateDay() {
    setDay({
      currDay: days[new Date().getDay()],
      currMonth: months[new Date().getMonth()],
      currDate: new Date().getDate(),
      currYear: new Date().getFullYear(),
    });
  }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
      toast({
        title: "Warning",
        description: "Not found data.",
      });
      return;
    }

    setIdLocation(id);
    localStorage.setItem("idLocation", id);
  }, []);

  let interval: any;
  useEffect(() => {
    interval = setInterval(() => {
      updateTime();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    interval = setInterval(() => {
      updateDay();
    }, 86400000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [ipAddress, setIpAddress] = useState("");
  const fetchIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org");
      const data = await response.text();
      setIpAddress(data);
    } catch (error) {
      setIpAddress("127.0.0.1");
    }
  };

  useEffect(() => {
    fetchIp();
  }, []);

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null);
    startTransition(async () => {
      values.ipAddress = ipAddress;      
      values.idLocation = idLocacion;
      
      if (state.button === 1) {
        values.type = "IN";
      }
      if (state.button === 2) {
        values.type = "OUT";
      }

      const response = await registerAction(values);

      if (response.error) {
        setError(response.error);
      } else {
        form.reset();

        const input = document.getElementById("doc");
        input?.focus();

        const fullName = response.employee;
        toast({
          title: "Success",
          description: `${fullName}: Your assistance has been registered.`,
        });
      }
    });
  }

  const { data: organizationItem } = useSWR<Organization>(
    `/api/organizations/register?idLocation=${idLocacion}`,
    fetcher
  );
  const { data: locationItem } = useSWR<Location>(
    `/api/locations/id?idLocation=${idLocacion}`,
    fetcher
  );

  const handleButtonOne = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 4 ? "" : value;
    form.setValue("identifier", newValue + "1");
  };
  const handleButtonTwo = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 4 ? "" : value;
    form.setValue("identifier", newValue + "2");
  };
  const handleButtonThree = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 4 ? "" : value;
    form.setValue("identifier", newValue + "3");
  };
  const handleButtonFour = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 4 ? "" : value;
    form.setValue("identifier", newValue + "4");
  };
  const handleButtonFive = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 4 ? "" : value;
    form.setValue("identifier", newValue + "5");
  };
  const handleButtonSix = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 4 ? "" : value;
    form.setValue("identifier", newValue + "6");
  };
  const handleButtonSeven = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 4 ? "" : value;
    form.setValue("identifier", newValue + "7");
  };
  const handleButtonEight = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 4 ? "" : value;
    form.setValue("identifier", newValue + "8");
  };
  const handleButtonNine = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 4 ? "" : value;
    form.setValue("identifier", newValue + "9");
  };
  const handleButtonZero = () => {
    const value = form.getValues("identifier");
    const newValue = value.length == 0 ? "" : value;
    form.setValue("identifier", newValue + "0");
  };

  return (
    <div className="bg-colorprimario1/90 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white  w-full max-w-4xl shadow-2xl rounded-xl p-8 flex gap-4">
        <div className="w-full flex flex-col gap-4">
          <div className="flex-1 bg-slate-100 rounded-xl p-4">
            <CameraVideo />
          </div>

          <div className="p-6 rounded-xl shadow-lg ">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={handleButtonOne}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                1
              </button>
              <button
                onClick={handleButtonTwo}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                2
              </button>
              <button
                onClick={handleButtonThree}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                3
              </button>
              <button
                onClick={handleButtonFour}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                4
              </button>
              <button
                onClick={handleButtonFive}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                5
              </button>
              <button
                onClick={handleButtonSix}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                6
              </button>
              <button
                onClick={handleButtonSeven}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                7
              </button>
              <button
                onClick={handleButtonEight}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                8
              </button>
              <button
                onClick={handleButtonNine}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                9
              </button>
              <button
                onClick={handleButtonZero}
                className=" bg-colorprimario1/95 text-white text-xl font-medium p-4 rounded-lg shadow-md hover:bg-colorprimario2"
              >
                0
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white  w-full shadow-2xl rounded-xl p-8">
          <div className="text-center flex justify-center">
            <img
              className="w-3/5"
              src={organizationItem?.logo ?? "/fravano_logo.png"}
              alt="logo"
            />
          </div>

          <div className="relative p-8 bg-colorprimario1/95 rounded-xl mt-6">
            <div className="flex items-baseline justify-center space-x-2 text-5xl font-bold">
              <span className="text-colorprimario2">
                {time.hours < 10 ? `0${time.hours}` : time.hours}
              </span>
              <span className="text-gray-400">:</span>
              <span className="text-colorprimario2">
                {time.minutes < 10 ? `0${time.minutes}` : time.minutes}
              </span>
              <span className="text-gray-400">:</span>
              <span className="text-colorprimario2">
                {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
              </span>
              <span className="text-sm text-gray-400 font-normal">
                {time.zone}
              </span>
            </div>

            <div className="mt-4 text-center text-sm text-gray-300 tracking-wide">
              {day.currDay} {day.currDate}, {day.currMonth} {day.currYear}
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
            >
              {" "}
              <div className="flex flex-col items-center">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
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
                      <FormDescription>
                        Please enter your User ID.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {errorForm && <FormMessage>{errorForm}</FormMessage>}
              <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <Button
                  onClick={() => (state.button = 1)}
                  type="submit"
                  name="btnIn"
                  value="IN"
                  className=" w-full bg-colorprimario3 text-white py-6 text-xl rounded-lg hover:bg-colorprimario2 hover:text-white focus:ring focus:ring-primary transition-colors duration-300 ease-in-out"
                  disabled={isPending}
                >
                  IN
                </Button>

                <Button
                  onClick={() => (state.button = 2)}
                  type="submit"
                  name="btnOut"
                  value="OUT"
                  className=" w-full bg-colorprimario4 text-white py-6 text-xl rounded-lg hover:bg-colorprimario2 hover:text-white focus:ring focus:ring-primary transition-colors duration-300 ease-in-out"
                  disabled={isPending}
                >
                  OUT
                </Button>
              </div>
              <div className="flex flex-col items-center">
                This Hub: <b>{locationItem?.name ?? "-"}</b>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default FormRegister;
