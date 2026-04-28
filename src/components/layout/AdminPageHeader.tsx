import type { LucideIcon } from "lucide-react";

type AdminPageHeaderProps = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const AdminPageHeader = ({
    icon: Icon,
    title,
    description,
}: AdminPageHeaderProps) => {
    return (
        <div className="mb-8 flex items-start gap-4">
            <div
                className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{
                    background:
                        "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                    boxShadow:
                        "0 10px 24px -8px rgba(42,143,212,0.55), 0 2px 6px -2px rgba(28,111,181,0.3), inset 0 1px 0 0 rgba(255,255,255,0.4)",
                }}
            >
                <Icon className="size-6" strokeWidth={2.4} />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#00334d]">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-[#5e6c87]">{description}</p>
            </div>
        </div>
    );
};

export default AdminPageHeader;
