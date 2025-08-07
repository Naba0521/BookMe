import { CompanyBackgroundImageEdit } from "./CompanyBackgroundImageEdit";
import { CompanyLogoEdit } from "./CompanyLogoEdit";

import { CompanyOtherPictures } from "./CompanyOtherPictures";

export function ImagesSettingsPage() {
  return (
    <div className="space-y-6 w-full h-full min-h-[calc(100vh-80px)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Компанийн зураг</h1>
        <p className="text-muted-foreground">Компанийн зураг засварлах хэсэг</p>
      </div>

      <div className="grid gap-6">
        <CompanyLogoEdit />
        <CompanyOtherPictures />
        <CompanyBackgroundImageEdit />
      </div>
    </div>
  );
}
