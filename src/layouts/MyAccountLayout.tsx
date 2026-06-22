import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import MyAccountSidebar from "@/components/layout/MyAccountSidebar";

type MyAccountLayoutProps = {
  children?: ReactNode;
};

const MyAccountLayout = ({ children }: MyAccountLayoutProps) => {
  const isAuth = useAuthStore((state) => state.isAuth);

  if (!isAuth) return <Navigate to="/login" replace />;

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(at 12% 18%, hsla(201,80%,70%,0.22) 0px, transparent 55%), radial-gradient(at 88% 85%, hsla(210,90%,65%,0.18) 0px, transparent 55%), radial-gradient(at 60% 50%, hsla(195,85%,80%,0.12) 0px, transparent 60%)",
        }}
      />

      <main className="flex min-h-screen items-start justify-center px-6 py-10">
        <div className="flex w-full max-w-[1040px] items-start gap-6">
          <MyAccountSidebar />

          <section
            className="min-w-0 flex-1 self-stretch rounded-[28px] border border-white/60 bg-white/45 p-7 backdrop-blur-2xl sm:p-9"
            style={{
              boxShadow:
                "0 12px 40px -14px rgba(0,46,71,0.14), 0 2px 8px -2px rgba(0,46,71,0.06), inset 0 1px 0 0 rgba(255,255,255,0.75)",
            }}
          >
            {children ?? <Outlet />}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyAccountLayout;
