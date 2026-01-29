interface Env {
  ADMIN_SECRET: string;
  ADMIN_PASSWORD: string;
}

function unauthorized() {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // Sadece POST kabul et
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Basic Auth kontrolü
  const auth = request.headers.get("Authorization");
  if (!auth) return unauthorized();

  const [type, encoded] = auth.split(" ");
  if (type !== "Basic" || !encoded) return unauthorized();

  try {
    const decoded = atob(encoded);
    const [, password] = decoded.split(":");

    if (password !== env.ADMIN_PASSWORD) {
      return unauthorized();
    }
  } catch {
    return unauthorized();
  }

  // Body'yi al ve API'ye ilet
  const body = await request.text();

  try {
    const apiRes = await fetch(
      "https://tech-portal-api.turgut-d01.workers.dev/admin/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-ADMIN-SECRET": env.ADMIN_SECRET,
        },
        body,
      }
    );

    const responseText = await apiRes.text();

    return new Response(responseText, {
      status: apiRes.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "API bağlantı hatası" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
