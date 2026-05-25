import decodeJwtPayload from "@/utils/DecodeJWT";

export function getUserScopeFromToken(): string | null {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
        const payload = decodeJwtPayload(token);
        return typeof payload.scope === "string" ? payload.scope : null;
    } catch {
        return null;
    }
}

export function isAdminToken(): boolean {
    return getUserScopeFromToken() === "ADMIN";
}
