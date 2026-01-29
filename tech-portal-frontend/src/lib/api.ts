export function getApiBase(request: Request) {
  // Production (Pages)
  if (request.headers.get("host")?.includes("pages.dev") ||
      request.headers.get("host")?.includes("3d-labx.com")) {
    return "https://tech-portal-api.turgut-d01.workers.dev";
  }

  // Local
  return "http://localhost:8787";
}
