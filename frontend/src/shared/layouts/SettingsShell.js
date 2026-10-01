"use client";

import { useLogout } from "@/features/auth/hooks/useLogout";
import { SettingsHeader } from "@/shared/components/organisms";

export function SettingsShell({ children }) {
  const { logout, isLoggingOut } = useLogout();

  return (
    <>
      <SettingsHeader onLogout={logout} isLoggingOut={isLoggingOut} />
      {children}
    </>
  );
}
