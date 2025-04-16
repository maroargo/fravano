import React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "My Health Ride",
  description: "My Health Ride dev app",
};

export default function RootLayout({ children } : Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body
                className="font-work-sans"
            >
                <Providers>{children}</Providers>
            </body>
        </html>        
    )
}