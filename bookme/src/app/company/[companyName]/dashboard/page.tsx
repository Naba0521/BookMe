"use client";
import { useEffect, useState, useCallback } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AllOrdersPage } from "./_components/AllOrders";
import { StaffOrdersPage } from "./_components/StaffOrders";
import { GeneralSettingsPage } from "./_components/General";
import { ImagesSettingsPage } from "./_components/Images";
import { EmployeesPage } from "./_components/EmployeesPage";
import { DashboardHeader } from "./_components/DashboardHeader";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { Company } from "../_components/CompanyTypes";
import { redirect } from "next/navigation";
import { api } from "@/axios";
import { toast } from "sonner";
import { CompanyWorkingHours } from "./_components/CompanyWorkingHours";
import { CompanyLocationGetData } from "./_components/CompanyLocationGetData";
import { EditTemplates } from "./_components/EditTemplate";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  ShoppingCart,
  Settings,
  ChevronDown,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("employees");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { company: loggedInCompany, loading: companyLoading } =
    useCompanyAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/company/id/${loggedInCompany?._id}`);

      if (response.data?.company) {
        setCompany(response.data.company);
        return response.data.company;
      }
      throw new Error("Company data not found");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error("Failed to fetch company");
      return null;
    } finally {
      setLoading(false);
    }
  }, [loggedInCompany?._id]);

  useEffect(() => {
    if (!companyLoading && !loggedInCompany) {
      redirect("/signin");
    } else if (loggedInCompany?._id) {
      fetchCompany();
    }
  }, [companyLoading, loggedInCompany?._id, fetchCompany]);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[500px] w-full">Loading...</div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <div className="text-red-500">{error}</div>
          <Button variant="outline" onClick={fetchCompany}>
            Retry
          </Button>
        </div>
      );
    }
    if (!company) {
      return (
        <div className="flex items-center justify-center min-h-[500px] text-gray-500">
          No company data
        </div>
      );
    }

    switch (currentPage) {
      case "employees":
        return <EmployeesPage />;
      case "all-orders":
        return <AllOrdersPage company={company} />;
      case "staff-orders":
        return <StaffOrdersPage company={company} />;
      case "general-settings":
        return <GeneralSettingsPage />;
      case "images-settings":
        return <ImagesSettingsPage />;
      case "location-settings":
        return <CompanyLocationGetData />;
      case "working-hours-settings":
        return <CompanyWorkingHours company={company} />;
      case "templates-settings":
        return (
          <EditTemplates company={company} fetchCompany={fetchCompany} />
        );
      default:
        return <EmployeesPage />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 w-full">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:static lg:inset-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            flex flex-col border-r border-gray-200 bg-white
          `}
        >
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="text-sm font-semibold">
                {company?.companyName}
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden lg:block p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                <img className="overflow-hidden" src={company?.companyLogo}/>
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {company?.companyName}
                </div>
                <div className="text-xs text-gray-500">
                  Компаний хяналтын самбар
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => {
                setCurrentPage("employees");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition ${
                currentPage === "employees"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users className="w-5 h-5" />
              Ажилчид
            </button>
            <div>
              <button
                onClick={() =>
                  setCurrentPage(
                    currentPage === "all-orders" ||
                      currentPage === "staff-orders"
                      ? "employees"
                      : "all-orders"
                  )
                }
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition ${
                  ["all-orders", "staff-orders"].includes(currentPage)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  Захиалгууд
                </div>
                <ChevronDown
                  className={`w-4 h-4 transform transition ${
                    ["all-orders", "staff-orders"].includes(currentPage)
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {["all-orders", "staff-orders"].includes(currentPage) && (
                <div className="ml-4 mt-2 space-y-1">
                  <button
                    onClick={() => {
                      setCurrentPage("all-orders");
                      setSidebarOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
                      currentPage === "all-orders"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    Бүх захиалга
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage("staff-orders");
                      setSidebarOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
                      currentPage === "staff-orders"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    Ажилтны захиалга
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() =>
                  setCurrentPage(
                    [
                      "general-settings",
                      "images-settings",
                      "location-settings",
                      "working-hours-settings",
                      "templates-settings",
                    ].includes(currentPage)
                      ? "employees"
                      : "general-settings"
                  )
                }
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition ${
                  [
                    "general-settings",
                    "images-settings",
                    "location-settings",
                    "working-hours-settings",
                    "templates-settings",
                  ].includes(currentPage)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Тохиргоо
                </div>
                <ChevronDown
                  className={`w-4 h-4 transform transition ${
                    [
                      "general-settings",
                      "images-settings",
                      "location-settings",
                      "working-hours-settings",
                      "templates-settings",
                    ].includes(currentPage)
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {[
                "general-settings",
                "images-settings",
                "location-settings",
                "working-hours-settings",
                "templates-settings",
              ].includes(currentPage) && (
                <div className="ml-4 mt-2 space-y-1">
                  <button
                    onClick={() => {
                      setCurrentPage("general-settings");
                      setSidebarOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
                      currentPage === "general-settings"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    Ерөнхий
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage("images-settings");
                      setSidebarOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
                      currentPage === "images-settings"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    Компаний зураг
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage("location-settings");
                      setSidebarOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
                      currentPage === "location-settings"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    Байршил
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage("working-hours-settings");
                      setSidebarOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
                      currentPage === "working-hours-settings"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    Ажлын цаг
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage("templates-settings");
                      setSidebarOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
                      currentPage === "templates-settings"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    Веб дизайн
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <a
              href={`/company/${company?.companyName}`}
              className="flex items-center gap-3 text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Буцах
            </a>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden w-full">
          <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="text-sm font-semibold">
                {company?.companyName}
              </div>
            </div>
          </div>

          <DashboardHeader currentPage={currentPage} />
          
          <div className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 w-full">
            <div className="w-full max-w-none mx-auto">
              {renderPage()}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}