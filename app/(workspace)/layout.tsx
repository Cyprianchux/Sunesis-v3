import { AppHeader } from "../../components/app-header";
export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen pt-20">{children}</main>
    </>
  );
}
