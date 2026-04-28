import type { ReactNode } from "react";

type AuthLayoutProps = {
    children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-background via-muted/20 to-background p-4">
            {children}
        </div>
    );
};

export default AuthLayout;
