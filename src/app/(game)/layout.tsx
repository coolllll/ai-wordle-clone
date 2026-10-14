import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function GameLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <AppShell username={user.username}>{children}</AppShell>;
}
