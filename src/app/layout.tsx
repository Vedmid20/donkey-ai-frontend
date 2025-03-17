"use client";

import React from 'react';
import './styles/globals.css';
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/app/_components/Sidebar";
import Profile from "@/app/_components/Profile";
import useAuth from "@/app/_hooks/loginRequired";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useAuth();
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My App</title>
      </head>
      <body>
          <Sidebar />
          <div className="">
            <SessionProvider session={null}>
              {children}
            </SessionProvider>
          </div>
        <Profile/>
      </body>
    </html>
  );
}
