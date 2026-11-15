const allowedOrigins = [
  "https://studio-classes.example.com",
  "https://preview.studio-classes.example.com",
];

export function corsHeaders(origin: string | null) {
  const allowed = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, content-type",
    Vary: "Origin",
  };
}
