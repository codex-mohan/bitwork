import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Bitwork",
  description: "Your Bitwork dashboard",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
