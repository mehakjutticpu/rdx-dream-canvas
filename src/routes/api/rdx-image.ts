import { createFileRoute } from "@tanstack/react-router";

const STYLE_HINTS: Record<string, string> = {
  photorealistic:
    "ultra photorealistic, 50mm lens, natural depth of field, true-to-life textures and lighting",
  cinematic: "cinematic film still, anamorphic lens, dramatic volumetric lighting, color graded",
  anime: "anime illustration, clean line art, vivid cel shading, expressive composition",
  "3d": "polished 3D render, octane style, soft global illumination, subtle subsurface scattering",
  surreal: "surreal dreamlike art, ethereal atmosphere, vivid saturated palette, imaginative scale",
};

const RATIOS: Record<string, string> = {
  "1:1": "1024x1024",
  "16:9": "1536x864",
  "9:16": "864x1536",
};

export const Route = createFileRoute("/api/rdx-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { prompt, style, ratio } = (await request.json()) as {
          prompt?: string;
          style?: string;
          ratio?: string;
        };
        if (!prompt || !prompt.trim()) {
          return Response.json({ error: "Prompt is required" }, { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return Response.json({ error: "Image service is not configured." }, { status: 500 });
        }

        const hint = STYLE_HINTS[style ?? "cinematic"] ?? STYLE_HINTS["cinematic"]!;
        const size = RATIOS[ratio ?? "16:9"] ?? RATIOS["16:9"]!;
        const fullPrompt = `${prompt.trim()}. Style: ${hint}. Highly detailed, aspect ratio ${ratio ?? "16:9"}, output size ${size}.`;

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image",
            messages: [{ role: "user", content: fullPrompt }],
            modalities: ["image", "text"],
          }),
        });

        if (!upstream.ok) {
          const detail = await upstream.text().catch(() => "");
          let message = "Image generation failed. Please try again.";
          if (upstream.status === 429) message = "Too many requests right now — try again shortly.";
          if (upstream.status === 402)
            message = "Image credits are exhausted. Add credits to keep generating.";
          try {
            const parsed = JSON.parse(detail);
            if (typeof parsed?.message === "string") message = parsed.message;
          } catch {
            /* keep default message */
          }
          return Response.json({ error: message }, { status: upstream.status });
        }

        const json: any = await upstream.json();
        const b64 = json?.data?.[0]?.b64_json;
        const directUrl = json?.data?.[0]?.url;
        if (b64) return Response.json({ url: `data:image/png;base64,${b64}` });
        if (typeof directUrl === "string") return Response.json({ url: directUrl });

        return Response.json({ error: "No image was returned. Try a different prompt." }, { status: 502 });
      },
    },
  },
});
