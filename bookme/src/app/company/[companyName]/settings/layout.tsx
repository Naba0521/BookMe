import { CompanySettingsProvider } from "./_providers/CompanySettingsProvider";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CompanySettingsProvider>{children}</CompanySettingsProvider>;
}
