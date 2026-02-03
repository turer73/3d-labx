export async function onRequest(context: any) {
  const { request, env } = context;

  // Body'yi olduğu gibi al
  const body = await request.text();

  // Worker'a secret ile ilet
  const apiRes = await fetch(
    "https://tech-portal-api.turgut-d01.workers.dev/admin/feature",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ADMIN-SECRET": env.ADMIN_SECRET,
      },
      body,
    }
  );

  return new Response(await apiRes.text(), {
    status: apiRes.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
