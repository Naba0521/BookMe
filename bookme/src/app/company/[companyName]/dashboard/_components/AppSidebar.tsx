"use client";

import * as React from "react";
import {
  Building2,
  Users,
  ShoppingCart,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import Link from "next/link";

interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function AppSidebar({ currentPage, setCurrentPage }: AppSidebarProps) {
  // const [ordersOpen, setOrdersOpen] = React.useState(false);
  const [openDropdownKey, setOpenDropdownKey] = React.useState<string | null>(
    null
  );
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { company, signOutCompany } = useCompanyAuth();
  const menuItems = [
    {
      title: "Ажилчид",
      icon: Users,
      key: "employees",
      onClick: () => setCurrentPage("employees"),
    },
    {
      title: "Захиалгууд",
      icon: ShoppingCart,
      key: "orders",
      hasDropdown: true,
      // isOpen: ordersOpen,
      // setOpen: setOrdersOpen,
      subItems: [
        {
          title: "Бүх захиалга",
          key: "all-orders",
          onClick: () => setCurrentPage("all-orders"),
        },
        {
          title: "Ажилтны захиалга",
          key: "staff-orders",
          onClick: () => setCurrentPage("staff-orders"),
        },
      ],
    },
    {
      title: "Тохиргоо",
      icon: Settings,
      key: "settings",
      hasDropdown: true,
      isOpen: settingsOpen,
      setOpen: setSettingsOpen,
      subItems: [
        {
          title: "Ерөнхий мэдээлэл",
          key: "general-settings",
          onClick: () => setCurrentPage("general-settings"),
        },
        {
          title: "Компаний зураг",
          key: "images-settings",
          onClick: () => setCurrentPage("images-settings"),
        },
        {
          title: "Байршил",
          key: "location-settings",
          onClick: () => setCurrentPage("location-settings"),
        },
        {
          title: "Ажлын цаг",
          key: "working-hours-settings",
          onClick: () => setCurrentPage("working-hours-settings"),
        },
        {
          title: "Template солих",
          key: "templates-settings",
          onClick: () => setCurrentPage("templates-settings"),
        },
      ],
    },
  ];

  const isActive = (key: string) => currentPage === key;
  const isParentActive = (subItems: any[]) =>
    subItems.some((item) => currentPage === item.key);

  return (
    <Sidebar className=" border-border/40 ">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007FFF] text-white">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {company?.companyName}
            </span>
            <span className="text-xs text-muted-foreground">
              Компаний хяналтын самбар
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  {item.hasDropdown ? (
                    <Collapsible
                      open={openDropdownKey === item.key}
                      onOpenChange={() => {
                        setOpenDropdownKey((prev) =>
                          prev === item.key ? null : item.key
                        );
                      }}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "hover:text-blue-600 cursor-pointer p-5 hover:bg-blue-200  hover:border-blue-100 hover:border-[1px]",
                            (isParentActive(item.subItems || []) ||
                              item.isOpen) &&
                              "bg-blue-50 text-blue-600 shadow-sm border border-blue-100 cursor-pointer hover:text-blue-600 "
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          {item.isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                openDropdownKey === item.key
                                  ? "rotate-0"
                                  : "-rotate-90"
                              )}
                            />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <SidebarMenuSub>
                          {item.subItems?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.key}>
                              <SidebarMenuSubButton
                                onClick={subItem.onClick}
                                className={cn(
                                  " p-5 cursor-pointer hover:bg-[#F0F6FE] border-[#d9e8fc] hover:border-[1px]",
                                  isActive(subItem.key) &&
                                    "p-5 bg-[#5687f9] shadow-2xl text-white hover:bg-[#5687f9]  hover:text-white  hover:border-[1px] border-[1px] hover:border-[#3869fa] border-[#3869fa]"
                                )}
                              >
                                {subItem.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      onClick={item.onClick}
                      className={cn(
                        "hover:text-blue-600 cursor-pointer p-5 hover:bg-blue-100  hover:border-blue-100 hover:border-[1px]",
                        isActive(item.key) &&
                          "p-5 bg-[#4F80EE]  hover:bg-[#007FFF] hover:text-white text-white border-[1px] border-[#3869fa] shadow-2xl"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-border/40 p-4">
        <Link href={`/company/${company?.companyName}`}>
          <button className="cursor-pointer flex justify-center items-center w-full rounded-4xl gap-2 p-2 bg-[#4F80EE]  hover:bg-[#007FFF] hover:text-white text-white border-[1px] border-[#3869fa] shadow-2xl">
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </button>
        </Link>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
