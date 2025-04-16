"use client";

import React, {useState} from 'react';
import useSWR from "swr";

import CreateRole from "@/components/roles/create-role";
import UpdateRole from "@/components/roles/update-role";
import DeleteRole from "@/components/roles/delete-role";
import AccessRole from '@/components/roles/access-role';
import { IRole } from '@/interfaces/role';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Roles() {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: roles,
    error,
    isLoading,
  } = useSWR<IRole[]>("/api/roles", fetcher);

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

  const roleList = roles || [];

  const filteredData = roleList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Roles</h1>

          <CreateRole />
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

          <input 
            type="text" 
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md  px-3 py-1 focus-visible:ring-rojo1 focus-visible:outline-none focus-visible:ring-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-rojo1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{r.name}</td>
                    <td className="px-4 py-2">{r.status}</td>
                    <td className="px-4 py-2">
                      <UpdateRole role={r} />
                      <DeleteRole id={r.id} />
                      <AccessRole role={r} />
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
