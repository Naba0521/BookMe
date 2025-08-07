import { EditCompanyBasicInfo } from "./EditCompanyBasicInfo";
import { EditCompanyContactInfo } from "./EditCompanyContactInfo";

export function GeneralSettingsPage() {
  return (
        <div className="min-h-screen w-full bg-gray-50"> 
      <div className="container mx-auto px-4 py-8 max-w-7xl">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ерөнхий мэдээлэл</h1>
        <p className="text-muted-foreground">Компаний мэдээллээ шинэчлэх</p>
      </div>

      <div className="grid gap-6">
        <EditCompanyBasicInfo />

        <EditCompanyContactInfo />
      </div>
    </div>
    </div>
    </div>
  );
}
