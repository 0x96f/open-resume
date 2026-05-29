import { BuilderStoreProvider } from "@/app/(builder)/BuilderStoreProvider";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BuilderStoreProvider>{children}</BuilderStoreProvider>;
}
