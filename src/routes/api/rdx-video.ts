import { createFileRoute } from "@tanstack/react-router";

const ENDPOINT = "https://anabot.my.id/api/ai/text2video";

export const Route = createFileRoute("/api/rdx-video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { prompt } = (await request.json()) as { prompt?: string };
        if (!prompt || !prompt.trim()) {
          return Response.json({ error: "Prompt is required" }, { status: 400 });
        }

        const apikey = process.env["ANABOT_API_KEY"] ?? "freeApikey";
        const url = `${ENDPOINT}?prompt=${encodeURIComponent(prompt)}&apikey=${encodeURIComponent(apikey)}`;

        try {
          const res = await fetch(url, { headers: { accept: "application/json" } });
          const text = await res.text();
          let json: any = null;
          try {
            json = JSON.parse(text);
          } catch {
            return Response.json(
              { error: "The video service returned an unexpected response." },
              { status: 502 },
            );
          }

          const video = json?.data?.result ?? json?.result;
          if (!res.ok || !json?.success || typeof video !== "string") {
            const message =
              typeof json?.error === "string"
                ? json.error
                : (json?.error?.message ?? "Video generation failed. Please try again.");
            return Response.json({ error: message }, { status: res.ok ? 502 : res.status });
          }

          return Response.json({ url: video });
        } catch {
          return Response.json(
            { error: "Could not reach the video service. Please try again." },
            { status: 502 },
          );
        }
      },
    },
  },
});
