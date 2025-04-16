"use client";

import React, {useState} from 'react';

import CreateLocation from "@/components/locations/create-location";
import DeleteLocation from "@/components/locations/delete-location";
import UpdateLocation from "@/components/locations/update-location";
import QRLocation from '@/components/locations/qr-location';
import useSWR from "swr";
import { ILocation } from '@/interfaces/location';
import { Role } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Locations() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);  
  const isStandarAdmin = role ? role.name == "Standar Admin" : false;

  const {
    data: locations,
    error,
    isLoading,
  } = useSWR<ILocation[]>("/api/locations", fetcher);

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

  const locationList = locations || [];

  const filteredData = locationList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );  

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Locations</h1>
          
          {isStandarAdmin && (                        
            <CreateLocation />
          )}
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
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-colorprimario1 rounded-md  px-3 py-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-colorprimario1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>                
                <th className="px-4 py-2 text-left">Address</th>                
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((loc) => (
                  <tr
                    key={loc.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2"><b>{loc.name}</b> <br /> {loc.organization?.name}</td>                    
                    <td className="px-4 py-2">{loc.address}</td>                    
                    <td className="px-4 py-2">{loc.status}</td>
                    <td className="px-4 py-2">
                      <UpdateLocation location={loc} />
                      <DeleteLocation id={loc.id} />

                      <QRLocation id={loc.id} />
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
