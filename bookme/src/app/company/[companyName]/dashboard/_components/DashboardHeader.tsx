import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface DashboardHeaderProps {
  currentPage: string;
}

export function DashboardHeader({ currentPage }: DashboardHeaderProps) {
  const getPageTitle = (page: string) => {
    const titles: Record<string, string> = {
      employees: "Ажилтнууд",
      "all-orders": "Бүх захиалга",
      "staff-orders": "Ажилтны захиалга",
      "general-settings": "Ерөнхий мэдээлэл",
      "images-settings": "Компанийн зураг",
      "location-settings": "Байршил",
      "working-hours-settings": "Байгууллагын цаг",
    };
    return titles[page] || "Дизайн";
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
      <SidebarTrigger className="-ml-1 " />
      <Separator orientation="vertical" className="mr-2 h-4 " />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              {getPageTitle(currentPage)}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
