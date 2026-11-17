import { Footer } from "@/components/layout/Footer";
import { GNB } from "@/components/layout/GNB";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <GNB />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
