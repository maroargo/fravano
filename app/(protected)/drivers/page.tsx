"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { formatDate } from "@fullcalendar/core";

import CreateDriver from "@/components/drivers/create-driver";
import UpdateDriver from "@/components/drivers/update-driver";
import DeleteDriver from "@/components/drivers/delete-driver";
import { IDriver } from "@/interfaces/driver";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Drivers() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: drivers,
    error,
    isLoading,
  } = useSWR<IDriver[]>("/api/drivers", fetcher);

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

  const driverList = drivers || [];

  const filteredData = driverList.filter((item) =>
    item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Drivers</h1>

          <CreateDriver />
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
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">DL Number</th>
                <th className="px-4 py-2 text-left">DL State</th>
                <th className="px-4 py-2 text-left">DL Expiration Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">
                      {driver.user?.name}
                      <br /> <b>{driver.user?.email}</b>
                      <br /> <b>{driver.user?.phone}</b>
                    </td>
                    <td className="px-4 py-2">{driver.licenseNumber}</td>
                    <td className="px-4 py-2">{driver.licenseState?.name}</td>
                    <td className="px-4 py-2">
                      {formatDate(driver.dateExpiredLicense!, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">{driver.status}</td>
                    <td className="px-4 py-2">
                      <UpdateDriver driver={driver} />
                      <DeleteDriver id={driver.id} />
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
