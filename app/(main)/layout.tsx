import Navbar from "@/app/_components/navbar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-12 mt-12">{children}</main>
    </>
  );
}
