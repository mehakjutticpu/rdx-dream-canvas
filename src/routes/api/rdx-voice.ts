import { createFileRoute } from "@tanstack/react-router";

const VOICES = new Set(["alloy", "echo", "fable", "onyx", "nova", "shimmer", "coral", "ash"]);

export const Route = createFileRoute("/api/rdx-voice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { text?: string; voice?: string; tone?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request body." }, { status: 400 });
        }

        const text = (body.text ?? "").trim();
        if (!text) {
          return Response.json({ error: "Please enter some text to speak." }, { status: 400 });
        }
        if (text.length > 2000) {
          return Response.json({ error: "Please keep the text under 2000 characters." }, { status: 400 });
        }
        const voice = VOICES.has(body.voice ?? "") ? body.voice! : "alloy";
        const tone = (body.tone ?? "").trim().slice(0, 200);

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return Response.json({ error: "Voice service is not configured." }, { status: 500 });
        }

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: text,
            voice,
            ...(tone ? { instructions: tone } : {}),
            response_format: "mp3",
            stream_format: "audio",
          }),
        });

        if (!upstream.ok) {
          const detail = await upstream.text().catch(() => "");
          let message = "The voice service failed. Please try again.";
          if (upstream.status === 402) {
            message = "AI credits are finished — the app owner needs to top up in Lovable.";
          } else if (upstream.status === 429) {
            message = "Too many requests right now — wait a moment and try again.";
          }
          console.error("rdx-voice upstream error", upstream.status, detail.slice(0, 300));
          return Response.json({ error: message }, { status: 502 });
        }

        const audio = await upstream.arrayBuffer();
        return new Response(audio, {
          headers: { "Content-Type": "audio/mpeg" },
        });
      },
    },
  },
});
