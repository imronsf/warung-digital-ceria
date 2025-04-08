
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  History, 
  BarChart, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SidebarLink = ({ to, icon: Icon, children }: SidebarLinkProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        <Icon size={20} />
        <span>{children}</span>
      </NavLink>
    </li>
  );
};

const Sidebar = () => {
  return (
    <div className="border-r border-border h-screen sticky top-0 w-64 bg-sidebar flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-center">
        <h2 className="text-xl font-bold text-primary">UMKM POS</h2>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <SidebarLink to="/kasir" icon={ShoppingCart}>Kasir</SidebarLink>
          <SidebarLink to="/produk" icon={Package}>Produk</SidebarLink>
          <SidebarLink to="/riwayat" icon={History}>Riwayat Transaksi</SidebarLink>
          <SidebarLink to="/laporan" icon={BarChart}>Laporan</SidebarLink>
          <SidebarLink to="/pengguna" icon={Users}>Pengguna</SidebarLink>
          <SidebarLink to="/pengaturan" icon={Settings}>Pengaturan</SidebarLink>
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full flex items-center gap-2">
          <LogOut size={16} />
          <span>Keluar</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
