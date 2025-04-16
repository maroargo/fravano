"use client";

import React, { useState } from "react";
import useSWR from "swr";

import CreateMaintenance from "@/components/maintenances/create-maintenance";
import DeleteMaintenance from "@/components/maintenances/delete-maintenance";
import ViewMaintenance from "@/components/maintenances/view-maintenance";
import { IMaintenance } from "@/interfaces/maintenance";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Maintenances() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: maintenances,
    error,
    isLoading,
  } = useSWR<IMaintenance[]>("/api/maintenances", fetcher);

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

  const maintenanceList = maintenances || [];

  const filteredData = maintenanceList.filter((item) =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Vehicles Maintenances</h1>

          <CreateMaintenance />
        </div>

        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm text-gray-600">
              <span className="pr-1">Show</span>

              <select className="border border-gray-300 rounded px-2 py-1">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="pl-1">entries</span>
            </label>
          </div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md  px-3 py-1 focus-visible:ring-1 focus-visible:ring-rojo1 focus-visible:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-rojo1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Vehicle</th>
                <th className="px-4 py-2 text-left">Driver</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Numbers</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((maintenance) => (
                  <tr
                    key={maintenance.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{maintenance.vehicle?.name}</td>
                    <td className="px-4 py-2">
                      {maintenance.vehicle?.driver?.user?.name}
                    </td>
                    <td className="px-4 py-2">{maintenance.description}</td>
                    <td className="px-4 py-2">
                      {maintenance.maintenanceDetails?.length}
                    </td>
                    <td className="px-4 py-2">{maintenance.status}</td>
                    <td className="px-4 py-2">
                      <ViewMaintenance maintenance={maintenance} />
                      <DeleteMaintenance id={maintenance.id} />
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
