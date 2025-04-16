"use client";

import React, {useState} from 'react';

import CreateOrganization from "@/components/organizations/create-organization";
import DeleteOrganization from "@/components/organizations/delete-organization";
import UpdateOrganization from "@/components/organizations/update-organization";
import { Role } from '@prisma/client';
import useSWR from "swr";
import UpdateParamOrganization from '@/components/organizations/update-params';
import { IOrganization } from '@/interfaces/organization';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Organizations() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<IOrganization[]>("/api/organizations", fetcher);  

  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role ? role.name == "Administrator" : false;
  const isStandarAdmin = role ? role.name == "Standar Admin" : false;

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

  const organizationList = organizations || [];

  const filteredData = organizationList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">{isAdmin ? "Organizations" : "Organization"}</h1>
          
          {isAdmin && (
            <CreateOrganization />
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
            placeholder="Buscar..."
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
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Address</th>                
                <th className="px-4 py-2 text-left">Timezone</th>
                <th className="px-4 py-2 text-left">Timeformat</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((org) => (
                  <tr
                    key={org.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{org.name}</td>
                    <td className="px-4 py-2">{org.email}</td>
                    <td className="px-4 py-2">{org.address}</td>  
                    <td className="px-4 py-2">{org.timezone?.name}</td> 
                    <td className="px-4 py-2">{org.timeformat?.name}</td>                  
                    <td className="px-4 py-2">{org.status}</td>
                    <td className="px-4 py-2">
                      <UpdateOrganization organization={org} />
                      {isAdmin && (
                        <DeleteOrganization id={org.id} />                        
                      )}  
                      {isStandarAdmin && (                        
                        <UpdateParamOrganization organizationParam={org.organizationParams[0]} />
                      )}                    
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
