import { QueryProvider } from "@/shared/providers/QueryProvider";

export default function AuthLayout({ children }) {
  return (
    <QueryProvider>
      <div id="main-content">{children}</div>
    </QueryProvider>
  );
}
