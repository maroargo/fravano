"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RouteTable from "@/components/routes/route-table";
import RouteCalendar from "@/components/routes/route-calendar";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function Route() {  

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY || ""} libraries={['places']}>
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <RouteTable />
        </TabsContent>
        <TabsContent value="calendar">
          <RouteCalendar />
        </TabsContent>
      </Tabs>
    </APIProvider>
  );
}

