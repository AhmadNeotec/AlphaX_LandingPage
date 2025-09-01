export const API_AUTH_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN || 'token 101b66b9233a2d9:caecd2de1119069';

export function withApiAuthHeaders(headers?: HeadersInit): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': API_AUTH_TOKEN,
    ...(headers || {}),
  } as HeadersInit;
}


