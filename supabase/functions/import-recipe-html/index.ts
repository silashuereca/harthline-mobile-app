import { corsHeaders } from "../_shared/cores.ts";
// eslint-disable-next-line no-undef
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestData: { url: string } = await req.json();
    const { url } = requestData;
    const res = await fetch(url, {
      headers: {
        Accept: "text/html",
        // Add headers to mimic a browser
        "User-Agent": "Mozilla/5.0 (compatible; SupabaseEdgeFetcher/1.0)",
      },
    });
    const html = await res.text();

    return new Response(JSON.stringify({ html }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
