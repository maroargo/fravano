"use client";

import { Menu } from "@prisma/client";
import useSWR from "swr";
import CreateMenu from "@/components/menus/create-menu";
import DeleteMenu from "@/components/menus/delete-menu";
import UpdateMenu from "@/components/menus/update-menu";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Menus() {
  const {
    data: menus,
    error,
    isLoading,
  } = useSWR<Menu[]>("/api/menus", fetcher);

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

  const menuList = menus || [];

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Menus</h1>

          <CreateMenu />
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
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-rojo1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Url</th>
                <th className="px-4 py-2 text-left">Icon</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">              
              {menuList.map((menu) => (
                <tr
                  key={menu.id}                    
                >
                  <td className="px-4 py-2">{menu.name}</td>
                  <td className="px-4 py-2">{menu.url}</td>
                  <td className="px-4 py-2">{menu.icon}</td>
                  <td className="px-4 py-2">{menu.status}</td>
                  <td className="px-4 py-2"> 
                    <UpdateMenu menu={menu} />                   
                    <DeleteMenu id={menu.id} />
                  </td>
                </tr>
              ))}              
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
