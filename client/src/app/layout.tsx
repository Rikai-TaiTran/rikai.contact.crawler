"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { usePathname } from "next/navigation";
import BaseLayout from "../components/layouts/BaseLayout"; // Import BaseLayout
import ProtectedLayout from "../components/layouts/ProtectedLayout"; // Import ProtectedLayout
import "./globals.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  if (pathname === "/login") {
    return <Provider store={store}><BaseLayout>{children}</BaseLayout></Provider>;
  }

  return <Provider store={store}><ProtectedLayout>{children}</ProtectedLayout></Provider>;
};

export default Layout;
