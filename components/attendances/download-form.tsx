"use client";

import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { IAttendance, IExcelAttendance } from "@/interfaces/attendance";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { formatDate } from "@fullcalendar/core";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DownloadForm() {
  const { toast } = useToast();
  const [dateIni, setDateIni] = useState<Date | undefined>(new Date());
  const [dateEnd, setDateEnd] = useState<Date | undefined>(new Date());

  const { data: attendances } = useSWR<IAttendance[]>(
    `/api/attendances/report?dateRouteIni=${dateIni}&dateRouteEnd=${dateEnd}`,
    fetcher
  );

  const attendancesList = attendances || [];

  const onSubmit = async () => {
    
    if (attendancesList.length == 0) {
      toast({
        title: "Warning",
        description: "No records found.",
      });

      return;
    }    

    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";      

    const infoDown: IExcelAttendance[] = [];      
    attendancesList.map((row) => (                
      
      infoDown.push({ identifier: row.employee ? row.employee?.identifier : ""
        , employee: row.employee ? row.employee?.firstName + " " + row.employee?.lastName : ""  
        , type: row.type          
        , date: formatDate(row.date!, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZoneName: "short",
                  locale: "en",
                })
        , hub: row.location ? row.location?.name : ""
        , work_location: row.employee?.location ? row.employee.location?.name : ""
        , notes: row.notes
        , address: row.ipAddress })
    ));

    const ws = XLSX.utils.json_to_sheet(infoDown);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataExport = new Blob([excelBuffer], { type: fileType });
    
    FileSaver.saveAs(dataExport, "Fravano_" + Date.now().toString() + fileExtension);          

    toast({
      title: "Success",
      description: "Download success.",
    });

  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end mb-4 min-w-full gap-3">
        <Calendar
          mode="single"
          selected={dateIni}
          onSelect={(e) => {
            setDateIni(e);
          }}
        />

        <Calendar
          mode="single"
          selected={dateEnd}
          onSelect={(e) => {
            setDateEnd(e);
          }}
        />
       
      </div>

      <Button className="w-full relative"
        onClick={onSubmit}>
        DOWNLOAD
      </Button>
    </div>
  );
}
