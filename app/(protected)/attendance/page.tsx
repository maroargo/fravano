"use client";

import CreateAttendance from "@/components/attendances/create-attendance";
import UpdateAttendance from "@/components/attendances/update-attendance";
import { IAttendanceDetail, IAttendanceTotal } from "@/interfaces/attendance";

import React, { useState } from "react";
import useSWR from "swr";
import { mutate } from "swr";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@fullcalendar/core";
import { format } from "date-fns";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DownloadAttendance from "@/components/attendances/download-attendance";
import { Label } from "@/components/ui/label";
import { IEmployee } from "@/interfaces/employee";
import { Employee } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Attendances() {
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarOpenIni, setCalendarOpenIni] = useState(false);
  const [calendarOpenEnd, setCalendarOpenEnd] = useState(false);
  const [dateIni, setDateIni] = useState<Date | undefined>(new Date());
  const [dateEnd, setDateEnd] = useState<Date | undefined>(new Date());

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { data: employees } = useSWR<IEmployee[]>(
    "/api/employees/active",
    fetcher
  );

  const {
    data: attendance    
  } = useSWR<IAttendanceTotal[]>(
    `/api/attendances/hour?dateRouteIni=${
      dateIni ? dateIni : new Date()
    }&dateRouteEnd=${dateEnd ? dateEnd : ""}&idEmployee=${value}`,
    fetcher
  );

  const {
    data: attendances,
    error,
    isLoading,
  } = useSWR<IAttendanceDetail[]>(
    `/api/attendances/date?dateRouteIni=${
      dateIni ? dateIni : new Date()
    }&dateRouteEnd=${dateEnd ? dateEnd : ""}&idEmployee=${value}`,
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

  const attendancList = attendances || [];

  const filteredData = attendancList.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const employeeList = employees || [];

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Attendances</h1>

          <CreateAttendance onCreated={() => {
            mutate(`/api/attendances/date?dateRouteIni=${dateIni ? dateIni : new Date()}&dateRouteEnd=${dateEnd ? dateEnd : ""}&idEmployee=${value}`);
            mutate(`/api/attendances/hour?dateRouteIni=${dateIni ? dateIni : new Date()}&dateRouteEnd=${dateEnd ? dateEnd : ""}&idEmployee=${value}`);
          }} />

        </div>

        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center mb-4 gap-4">
            {/* Fecha de inicio */}
            <div className="pr-4 flex-1 max-w-[320px]">
              <Label>Date Ini: </Label>
              <Popover open={calendarOpenIni} onOpenChange={setCalendarOpenIni}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateIni && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateIni ? format(dateIni, "PPP") : <span>Pick a date ini</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateIni}
                    onSelect={(e) => {
                      setDateIni(e);
                      setCalendarOpenIni(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Fecha de fin */}
            <div className="pr-4 flex-1 max-w-[320px]">
              <Label>Date End: </Label>
              <Popover open={calendarOpenEnd} onOpenChange={setCalendarOpenEnd}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateEnd ? format(dateEnd, "PPP") : <span>Pick a date end</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateEnd}
                    onSelect={(e) => {
                      setDateEnd(e);
                      setCalendarOpenEnd(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Selector de empleado (más ancho) */}
            <div className="flex-[2]">
              <Label>Employee: </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? employeeList.find((emp) => emp.id === value)?.fullName
                      : "Select employee"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Search employee..."
                    className="w-full px-2 py-1 border rounded text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="max-h-60 overflow-y-auto">
                    {employeeList
                      .filter((emp) =>
                        emp.completeName.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((emp) => (
                        <div
                          key={emp.id}
                          className={cn(
                            "cursor-pointer px-2 py-1 rounded hover:bg-gray-100 flex justify-between items-center",
                            value === emp.id && "bg-gray-200 font-medium"
                          )}
                          onClick={() => {
                            setValue(emp.id === value ? "" : emp.id);
                            setOpen(false);
                          }}
                        >
                          <span>{emp.completeName}</span>
                          {value === emp.id && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    {employeeList.filter((emp) =>
                      emp.completeName.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 && (
                      <div className="text-sm text-gray-500 px-2 py-1">
                        No employees found.
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-colorprimario1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">User ID</th>
                <th className="px-4 py-2 text-left">Time In</th>
                <th className="px-4 py-2 text-left">Notes In</th>
                <th className="px-4 py-2 text-left">Time Out</th>
                <th className="px-4 py-2 text-left">Notes Out</th>
                <th className="px-4 py-2 text-left">Hours</th>
                <th className="px-4 py-2 text-left">Total Hours</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((asis, index) => (
                  <tr
                    key={asis.id}
                    className="hover:bg-gray-200 border-b border-[#D3D3D3] odd:bg-gray-100 even:bg-gray-50"
                  >                                   
                    <td className="px-4 py-2">
                      {formatDate(asis.date!, {
                        weekday: "long",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        locale: "en",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      {asis.firstName} {asis.lastName}
                    </td>
                    <td className="px-4 py-2">{asis.identifier}</td>
                    <td className="px-4 py-2">
                      {formatDate(asis.time_in!, {
                        hour: "2-digit",
                        minute: "2-digit",
                        locale: "en",
                      })}
                    </td>
                    <td className="px-4 py-2">{asis.notes_in}</td>
                    <td className="px-4 py-2">
                      {formatDate(asis.time_out!, {
                        hour: "2-digit",
                        minute: "2-digit",
                        locale: "en",
                      })}
                    </td>
                    <td className="px-4 py-2">{asis.notes_out}</td>
                    <td className="px-4 py-2">{asis.hours_diff}</td>
                    <td className="px-4 py-2">
                      
                    </td>
                    
                    <td className="px-4 py-2">
                      <UpdateAttendance attendance={asis} />                                          
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2">No results found</td>
                </tr>
              )}

              {filteredData.length > 0 && value && (
                <tr className="">
                  <td colSpan={6} className="px-4 py-2"></td>
                  <td className="px-4 py-2">
                    <b>Total Hours: </b>
                  </td>
                  <td className="px-4 py-2">
                    {attendance ? attendance[0].total_hours : "-"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4">
        <div>
          <DownloadAttendance />
        </div>
      </div>
    </>
  );
}
