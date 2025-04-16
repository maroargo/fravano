import useSWR from "swr";
import React, { useState } from "react";

import DeleteRoute from "./delete-route";
import CreateRoute from "./create-route";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { IRoute } from "@/interfaces/route";
import { StatusTrip } from "@prisma/client";
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

export default function RouteTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const {
    data: routes,
    error,
    isLoading,
  } = useSWR<IRoute[]>(
    `/api/routes/date?dateRoute=${date ? date : new Date()}`,
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

  const routeList = routes || [];

  const filteredData = routeList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 py-6 rounded-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">Routes</h1>

        <CreateRoute />
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
            placeholder="Search by route name..."
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
              <th className="px-4 py-2 text-left">Route Name</th>
              <th className="px-4 py-2 text-left">Assigned To</th>
              <th className="px-4 py-2 text-left">Date Route</th>              
              <th className="px-4 py-2 text-left">Routes</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredData.length > 0 ? (
              filteredData.map((route) => (
                <tr
                  key={route.id}
                  className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                >
                  <td className="px-4 py-2">
                    {route.name} <br /> Priority:{" "}
                    <b>{route.routePriority?.name}</b>{" "}
                  </td>
                  <td className="px-4 py-2">{route.driver?.user?.name}</td>
                  <td className="px-4 py-2">
                    {formatDate(route.dateRoute!, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      timeZoneName: "short",
                      locale: "en",
                    })} 
                    <br />
                    ({route.type?.name})
                  </td>                  
                  <td className="px-4 py-2">
                    {route.routeDetails.map((det) => (
                      <HoverCard key={det.id}>
                        <HoverCardTrigger>
                          {det.statusTrip == StatusTrip.complete && (
                            <Badge></Badge>
                          )}
                          {det.statusTrip == StatusTrip.pending && (
                            <Badge variant="destructive"></Badge>
                          )}
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <div>
                            <div>Route type: {route.routeType?.name}</div>
                            <div>Status trip: {det.statusTrip}</div>
                            <div>
                              {formatDate(det.estimation!, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                timeZoneName: "short",
                                locale: "en",
                              })}
                            </div>
                            <div>{det.address}</div>
                            <div>{det.notes}</div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </td>
                  <td className="px-4 py-2">{route.status}</td>
                  <td className="px-4 py-2">
                    <DeleteRoute id={route.id} />
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
  );
}
