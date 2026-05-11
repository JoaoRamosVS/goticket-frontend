import type { ReactNode } from "react";

import OrganizerSidebar from "@/components/layout/OrganizerSidebar";

type OrganizerLayoutProps = {
    children: ReactNode;
};

const OrganizerLayout = ({ children }: OrganizerLayoutProps) => {
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

            <OrganizerSidebar />

            <main className="ml-72 min-h-screen p-6 pl-2">
                <div
                    className="min-h-[calc(100vh-3rem)] rounded-[32px] border border-white/60 bg-white/45 p-8 backdrop-blur-2xl"
                    style={{
                        boxShadow:
                            "0 12px 40px -14px rgba(0,46,71,0.14), 0 2px 8px -2px rgba(0,46,71,0.06), inset 0 1px 0 0 rgba(255,255,255,0.75)",
                    }}
                >
                    {children}
                </div>
            </main>
        </div>
    );
};

export default OrganizerLayout;
