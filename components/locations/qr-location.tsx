"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import QRCode from "react-qr-code";

import { useState } from "react";

export default function QRLocation({ id }: { id: string }) {
  const [isDialogOpen, setDialogOpen] = useState(false);      
     
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;  
  const qrUrl = `${baseUrl}/register?id=${encodeURIComponent(id)}`;  
  console.log(qrUrl);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>       
        <Button
            variant="ghost"
            size="icon"
            className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
        >
            <MdOutlineQrCodeScanner className="h-4 w-4" />
        </Button>
        
      </DialogTrigger>      
      
      <DialogContent className="sm:max-w-[425px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>QR Location</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-md bg-white">
          <QRCode value={qrUrl} size={256} />
          <p className="mt-2 text-sm text-gray-600">Scan code to access</p>
        </div>                
        
      </DialogContent>
    </Dialog>
  );
}
