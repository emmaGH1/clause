// Pidgin voice note with sentence captions, from ElevenLabs text-to-speech with timestamps.
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const VOICE = process.env.ELEVEN_VOICE_ID ?? "0ooxr7N7JJjIsVylsgeF";
const key = () => process.env.ELEVENLABS_API_KEY ?? readFileSync(join(homedir(), ".config/elevenlabs/api_key"), "utf8").trim();

// lines: [{ pidgin, english }] in speaking order. Returns { audio, duration, captions: [{start,end,pidgin,english}] }
export async function speak(lines, outDir) {
  const text = lines.map((l) => l.pidgin.trim()).join(" ");
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": key(), "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.8 } }),
  });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  writeFileSync(join(outDir, "briefing.mp3"), Buffer.from(j.audio_base64, "base64"));
  const a = j.alignment ?? j.normalized_alignment;
  const ends = a.character_end_times_seconds, starts = a.character_start_times_seconds;
  const captions = [];
  let pos = 0;
  for (const l of lines) {
    const s = l.pidgin.trim();
    const from = pos, to = Math.min(pos + s.length, starts.length) - 1;
    captions.push({ start: starts[from] ?? 0, end: ends[to] ?? ends.at(-1), pidgin: s, english: l.english });
    pos += s.length + 1;
  }
  const duration = ends.at(-1);
  const vtt = "WEBVTT\n\n" + captions.map((c, i) => `${i + 1}\n${t(c.start)} --> ${t(c.end)}\n${c.english}\n`).join("\n");
  writeFileSync(join(outDir, "briefing.en.vtt"), vtt);
  return { audio: "briefing.mp3", vtt: "briefing.en.vtt", duration, captions };
}
const t = (s) => new Date(s * 1000).toISOString().slice(11, 23);
