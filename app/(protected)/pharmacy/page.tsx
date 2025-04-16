"use client";

import useSWR from "swr";
import React, { useState } from "react";

import { IPharmacy } from "@/interfaces/pharmacy";
import CreatePharmacy from "@/components/pharmacys/create-pharmacy";
import DeletePharmacy from "@/components/pharmacys/delete-pharmacy";
import ViewPharmacy from "@/components/pharmacys/view-pharmacy";

import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@fullcalendar/core";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Pharmacy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const {
    data: pharmacys,
    error,
    isLoading,
  } = useSWR<IPharmacy[]>(
    `/api/pharmacys/date?dateOrder=${date ? date : new Date()}`,
    fetcher
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[600px] bg-white">
        <div className="relative w-12 h-12">
          <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-ping opacity-25"></div>
        </div>
      </div>
    );

  if (error) return <div>Failed to load.</div>;

  const pharmacyList = pharmacys || [];

  const filteredData = pharmacyList.filter((item) =>
    item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Pharmacy Order's</h1>

          <CreatePharmacy />
        </div>

        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center mb-4">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(e) => {
                    setDate(e);
                    setCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md  px-3 py-1 focus-visible:ring-rojo1 focus-visible:outline-none focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-rojo1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Patient</th>
                <th className="px-4 py-2 text-left">Date Order</th>
                <th className="px-4 py-2 text-left">Date Delivery</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Order</th>
                <th className="px-4 py-2 text-left">Number Orders</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((pharma) => (
                  <tr
                    key={pharma.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{pharma.patient?.name} <br /> {pharma.patient?.patientId}</td>
                    <td className="px-4 py-2">{pharma.dateOrder ? format(pharma.dateOrder, "PPP") : "-"}</td>
                    <td className="px-4 py-2">{pharma.dateDelivery ? format(pharma.dateDelivery, "PPP") : "-"}</td>
                    <td className="px-4 py-2">{pharma.address}</td>
                    <td className="px-4 py-2">{pharma.order}</td>
                    <td className="px-4 py-2">
                      {pharma.pharmacyDetails?.length}
                    </td>
                    <td className="px-4 py-2">{pharma.status}</td>
                    <td className="px-4 py-2">
                      <ViewPharmacy pharmacy={pharma} />
                      <DeletePharmacy id={pharma.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
