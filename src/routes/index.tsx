import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RDX AI Studio — Text to Image, Video & Voice Generator" },
      {
        name: "description",
        content:
          "RDX AI Studio turns your words into cinematic images, videos and lifelike voiceovers. Write a prompt, pick a style, and generate in seconds.",
      },
      { property: "og:title", content: "RDX AI Studio — Text to Image, Video & Voice Generator" },
      {
        property: "og:description",
        content:
          "Turn a single prompt into cinematic AI images, videos and lifelike voices with RDX AI Studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

type Mode = "image" | "video" | "voice";

type Creation = {
  id: string;
  mode: Mode;
  prompt: string;
  url: string;
};

const STYLES = [
  { id: "cinematic", label: "Cinematic" },
  { id: "photorealistic", label: "Photoreal" },
  { id: "surreal", label: "Surreal" },
  { id: "anime", label: "Anime" },
  { id: "3d", label: "3D Render" },
];

const RATIOS = ["16:9", "1:1", "9:16"];

const VOICES = [
  { id: "alloy", label: "Alloy", desc: "Neutral & clear" },
  { id: "nova", label: "Nova", desc: "Warm & friendly" },
  { id: "shimmer", label: "Shimmer", desc: "Bright & upbeat" },
  { id: "coral", label: "Coral", desc: "Soft & expressive" },
  { id: "echo", label: "Echo", desc: "Calm & smooth" },
  { id: "fable", label: "Fable", desc: "Storyteller" },
  { id: "onyx", label: "Onyx", desc: "Deep & bold" },
  { id: "ash", label: "Ash", desc: "Relaxed & low" },
];

const TONES = [
  { id: "", label: "Natural" },
  { id: "Speak cheerfully and energetically.", label: "Cheerful" },
  { id: "Speak slowly, calmly and warmly.", label: "Calm" },
  { id: "Speak like a dramatic movie trailer narrator.", label: "Dramatic" },
  { id: "Speak like a professional news anchor.", label: "News Anchor" },
  { id: "Speak like telling a bedtime story to a child.", label: "Storytelling" },
];

const IDEAS = [
  "A classic red retro car parked on a hillside of pink wildflowers, pastel sky, distant moon, golden cinematic light",
  "Neon Tokyo alley in the rain, reflections on wet asphalt, steam rising, cyberpunk mood",
  "A whale gliding through clouds above a quiet mountain village at sunrise",
];

function Studio() {
  const [mode, setMode] = useState<Mode>("image");
  const [prompt, setPrompt] = useState(IDEAS[0]!);
  const [style, setStyle] = useState("cinematic");
  const [ratio, setRatio] = useState("16:9");
  const [voice, setVoice] = useState("nova");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Creation | null>(null);
  const [history, setHistory] = useState<Creation[]>([]);

  async function generate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (mode === "voice") {
        const res = await fetch("/api/rdx-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: prompt, voice, tone }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          setError(data.error ?? "Something went wrong. Please try again.");
          return;
        }
        const blob = await res.blob();
        const creation: Creation = {
          id: `${Date.now()}`,
          mode,
          prompt,
          url: URL.createObjectURL(blob),
        };
        setResult(creation);
        setHistory((h) => [creation, ...h].slice(0, 12));
        return;
      }
      const res = await fetch(mode === "image" ? "/api/rdx-image" : "/api/rdx-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, ratio }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      const creation: Creation = {
        id: `${Date.now()}`,
        mode,
        prompt,
        url: data.url,
      };
      setResult(creation);
      setHistory((h) => [creation, ...h].slice(0, 12));
    } catch {
      setError("Network issue — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const aspectClass =
    mode === "voice" || result?.mode === "voice"
      ? "aspect-[3/1]"
      : result?.mode === "video"
        ? "aspect-video"
        : ratio === "1:1"
          ? "aspect-square"
          : ratio === "9:16"
            ? "aspect-[9/16]"
            : "aspect-video";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="glow-bg pointer-events-none absolute inset-x-0 top-0 h-[640px]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="brand-bg flex size-10 items-center justify-center rounded-xl font-display text-lg font-bold text-primary-foreground">
            R
          </div>
          <div>
            <p className="font-display text-lg leading-none font-semibold">RDX AI Studio</p>
            <p className="text-xs text-muted-foreground">Prompt to picture &amp; motion</p>
          </div>
        </div>
        <span className="hidden rounded-full border border-border px-3 py-1 text-xs text-muted-foreground sm:block">
          Beta
        </span>
      </header>

      <section className="relative mx-auto max-w-3xl px-5 pt-6 pb-10 text-center">
        <h1 className="font-display text-4xl font-semibold sm:text-6xl">
          Create <span className="brand-text">anything</span> you can describe
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Write one prompt and RDX AI Studio renders a cinematic still image or an animated clip —
          no editing skills required.
        </p>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 pb-20">
        <div className="panel p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {(["image", "video", "voice"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  mode === m
                    ? "brand-bg text-primary-foreground shadow-brand-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {m === "image" ? "Image" : m === "video" ? "Video" : "Voice"}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">
              {mode === "video"
                ? "Clips take 1–3 minutes"
                : mode === "voice"
                  ? "Speech in a few seconds"
                  : "Images take a few seconds"}
            </span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder={
              mode === "voice"
                ? "Type the words you want spoken aloud…"
                : "Describe your scene: subject, mood, lighting, colours…"
            }
            className="mt-4 w-full resize-none rounded-xl border border-input bg-background/60 p-4 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {mode === "image" &&
              STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    style === s.id
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            {mode === "image" && <span className="mx-1 h-5 w-px bg-border" />}
            {mode === "image" &&
              RATIOS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    ratio === r
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="brand-bg rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand-glow transition-opacity disabled:opacity-50"
            >
              {loading
                ? mode === "video"
                  ? "Rendering your clip…"
                  : "Painting your image…"
                : `Generate ${mode}`}
            </button>
            <button
              onClick={() => setPrompt(IDEAS[Math.floor(Math.random() * IDEAS.length)]!)}
              className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Surprise me
            </button>
          </div>
        </div>

        <div className="panel mt-6 overflow-hidden p-4 sm:p-6">
          {error && (
            <p className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
              {error}
            </p>
          )}

          {loading && (
            <div className={`sheen w-full rounded-xl ${aspectClass}`}>
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {mode === "video"
                  ? "Generating motion — this can take a couple of minutes."
                  : "Generating your image…"}
              </div>
            </div>
          )}

          {!loading && !result && (
            <div
              className={`flex w-full items-center justify-center rounded-xl border border-dashed border-border ${aspectClass}`}
            >
              <p className="px-6 text-center text-sm text-muted-foreground">
                Your creation will appear here.
              </p>
            </div>
          )}

          {!loading && result && (
            <div>
              {result.mode === "video" ? (
                <video
                  src={result.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full rounded-xl bg-black"
                />
              ) : (
                <img
                  src={result.url}
                  alt={result.prompt}
                  className="w-full rounded-xl object-cover"
                />
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-xl text-xs text-muted-foreground">{result.prompt}</p>
                <a
                  href={result.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-muted"
                >
                  Download
                </a>
              </div>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-sm tracking-wide text-muted-foreground uppercase">
              Recent creations
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setResult(item)}
                  className="group overflow-hidden rounded-xl border border-border bg-secondary"
                >
                  {item.mode === "video" ? (
                    <video src={item.url} muted className="aspect-video w-full object-cover" />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="aspect-video w-full object-cover"
                    />
                  )}
                  <p className="line-clamp-1 px-2 py-2 text-left text-[11px] text-muted-foreground">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        RDX AI Studio — built for fast, beautiful AI creation.
      </footer>
    </main>
  );
}
