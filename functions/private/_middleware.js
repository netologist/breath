// Cloudflare Pages Function: HTTP Basic Auth gate for /notes/private/*.
//
// Credentials are read from the Pages project's environment variables /
// secrets — NEVER from this file:
//   AUTH_USER     (default: admin)
//   AUTH_PASSWORD (default: changeme)
//   AUTH_REALM    (optional, default: "Private Notes")
//
// Rotate the password any time, no code change and no redeploy:
//   printf '%s\n' 'new-password' | npx wrangler pages secret put AUTH_PASSWORD --project-name=<name>
//
// Deployed together with the site. When deploying prebuilt assets with
// wrangler, pass --functions=functions (see .github/workflows/cloudflare.yml).

export function onRequest(context) {
  const { request, env } = context;
  const user = env.AUTH_USER || 'admin';
  const pass = env.AUTH_PASSWORD || 'changeme';
  const realm = env.AUTH_REALM || 'Private Notes';

  const expected = 'Basic ' + btoa(`${user}:${pass}`);
  const auth = request.headers.get('Authorization') || '';

  if (auth === expected) {
    return context.next();
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}"`,
      'Cache-Control': 'no-store',
    },
  });
}
