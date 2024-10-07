"use client";

import React, { useState } from "react";
import "./globals.css";
import {
  FiBell,
  FiUser,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import { IoHome } from "react-icons/io5";
import logoImage from "./RIKAI株式会社.svg";
import { RiMenu3Fill } from "react-icons/ri";

import { FaUsers, FaChartLine } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const DefaultLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("Dashboard");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "w-64" : "w-30"
            } bg-white h-full transition-all duration-300 ease-in-out fixed left-0 top-0 z-50 shadow-lg`}
          >
            <div className="flex items-center justify-between p-4">
              <Image
                src={logoImage}
                className={`${
                  isSidebarOpen ? "w-32" : "w-12"
                } transition-all duration-300`}
              />
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
                aria-label={
                  isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"
                }
              >
                {isSidebarOpen ? (
                  <RiMenu3Fill size={24} />
                ) : (
                  <RiMenu3Fill size={24} />
                )}
              </button>
            </div>
            <nav className="mt-8 p-4">
              <ul>
                <li className="mb-2">
                  <Link
                    href="/toiawase"
                    className={`w-full text-left px-4 py-2 rounded-md "text-gray-700 hover:bg-gray-200"
                      } transition-colors duration-200 flex items-center ${
                        isSidebarOpen ? "justify-start" : "justify-center"
                      } ${
                      pathname.includes("toiawase")
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FaUsers className="mr-2" />
                    <span>Toiawase</span>
                  </Link>
                  <Link
                    href="/leads"
                    className={`w-full text-left px-4 py-2 rounded-md "text-gray-700 hover:bg-gray-200"
                      } transition-colors duration-200 flex items-center ${
                        isSidebarOpen ? "justify-start" : "justify-center"
                      } ${
                      pathname.includes("leads")
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FaUsers className="mr-2" />
                    <span>Leads</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div
            className={`flex-1 ${
              isSidebarOpen ? "ml-64" : "ml-20"
            } transition-all duration-300`}
          >
            {/* Header */}
            <header className="bg-white shadow-md p-4 top-0 right-0 left-0 z-40 flex justify-between items-center">
              <h2 className="text-2xl flex font-bold text-gray-800">
                <IoHome />
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
                  aria-label="Notifications"
                >
                  <FiBell size={24} />
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
                  aria-label="User Profile"
                >
                  <FiUser size={24} />
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
                  aria-label="Settings"
                >
                  <FiSettings size={24} />
                </button>
              </div>
            </header>

            {/* Dashboard Content */}
            <main className="mt-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
};

export default DefaultLayout;
