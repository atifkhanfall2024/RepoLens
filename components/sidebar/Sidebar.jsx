'use client'
import { motion } from "framer-motion";
import { Home, Folder, Settings, Bell } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");

  const menu = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "repos", name: "My Repos", icon: Folder },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const recent = [
    "repo-mind/api",
    "stripe-payments-demo",
  ];

  return (
    <div className="h-screen w-72 bg-white border-r flex flex-col justify-between">
      
      {/* Top Section */}
      <div>
        
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white w-8 h-8 rounded flex items-center justify-center font-bold">
              RM
            </div>
            <span className="font-semibold text-lg">RepoMind</span>
          </div>

          <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black transition" />
        </div>

        {/* Menu */}
        <div className="mt-5 px-3">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-1
                ${
                  isActive
                    ? "bg-gray-100 text-black"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Active Context */}
        <div className="px-5 mt-6">
          <p className="text-xs text-gray-400 mb-2 tracking-wider">
            ACTIVE CONTEXT
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 cursor-pointer"
          >
            <span className="text-blue-600 font-medium">
              acme-corp/frontend
            </span>
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          </motion.div>
        </div>

        {/* Recent Repos */}
        <div className="px-5 mt-6">
          <p className="text-xs text-gray-400 mb-2 tracking-wider">
            RECENT REPOS
          </p>

          {recent.map((repo, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between py-2 text-gray-600 cursor-pointer hover:text-black"
            >
              <span>{repo}</span>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom User */}
      <div className="border-t px-5 py-4 flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40"
          className="w-9 h-9 rounded-full"
        />

        <div>
          <p className="text-sm font-semibold">Alex Dev</p>
          <p className="text-xs text-gray-400">Pro Plan</p>
        </div>
      </div>
    </div>
  );
}