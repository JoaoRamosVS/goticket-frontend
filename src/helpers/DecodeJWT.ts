/**
 * Decodifica o payload de um JWT
 * @param token - O token JWT a ser decodificado
 * @returns O payload decodificado como um objeto
 */
export default function decodeJwtPayload(token: string): Record<string, unknown> {
    const base64Payload = token.split('.')[1];
    const jsonPayload = atob(base64Payload || '');
    return JSON.parse(jsonPayload);
}