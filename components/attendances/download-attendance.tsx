"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import DownloadForm from "./download-form";
import { useState } from "react";

export default function DownloadAttendance() {
  const [isDialogOpen, setDialogOpen] = useState(false);  

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Download</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Download attendances</DialogTitle>
        </DialogHeader>        
        
        <DownloadForm />
                
      </DialogContent>
    </Dialog>
  );
}
