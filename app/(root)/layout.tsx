import Header from "@/components/layout/Header";
import AffiliateBanner from "@/components/layout/AffiliateBanner";
import Footer from "@/components/layout/Footer";
import UsernameGate from "@/components/auth/UsernameGate";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <AffiliateBanner />
      <main className="flex-1">
        <UsernameGate>
          {children}
        </UsernameGate>
      </main>
      <Footer />
    </>
  );
}
