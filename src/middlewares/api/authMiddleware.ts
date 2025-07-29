export function authMiddleware(request: Request): { isValid: boolean } {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { isValid: false };
  }

  const token = authHeader.split(" ")[1];

  return { isValid: validate(token) };
}

function validate(token: string): boolean {
  // ❌ Simulated validation (replace with real logic)
  if (!token || token !== "my-secret-token") {
    return false;
  }

  return true;
}
