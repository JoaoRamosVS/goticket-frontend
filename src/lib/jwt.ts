import decodeJwtPayload from "@/utils/DecodeJWT";

export function getCurrentUserId(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    return (decodeJwtPayload(token)?.sub as string) ?? null;
  } catch {
    return null;
  }
}
