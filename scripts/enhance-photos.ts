import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

async function enhance(input: string, output: string, prompt: string, size: string) {
  const buf = fs.readFileSync(input);
  const b64 = buf.toString("base64");
  const ext = input.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  const dataUrl = `data:image/${ext};base64,${b64}`;

  const zai = await ZAI.create();
  console.log(`Editing ${input} -> ${output} (${size})...`);
  const res = await zai.images.generations.edit({
    prompt,
    images: [{ url: dataUrl }],
    size,
  });
  const out = res.data[0].base64;
  fs.writeFileSync(output, Buffer.from(out, "base64"));
  console.log(`✓ Saved ${output} (${fs.statSync(output).size} bytes)`);
}

const PROMPT_STREET =
  "Enhance this photograph of a modest orphanage building on a residential street in Indonesia. Apply warm golden-hour cinematic color grading with rich amber and sepia tones, soft warm sunlight breaking through overcast sky, gentle vignette darkening the edges, slightly enhanced contrast and depth, subtle fine film grain. Keep the building, the 'Rumah Buah Hati' sign, bougainvillea flowers, street, power lines, and all text completely unchanged and readable. Mood: dignified, warm, sentimental, hopeful, reverent. Do not add or remove any objects, people, or text. Preserve documentary realism.";

const PROMPT_FACADE =
  "Enhance this photograph of an orphanage building facade with a green sign in Indonesia. Apply warm golden-hour cinematic color grading with rich amber and sepia tones, soft warm sunlight, gentle vignette darkening the edges, slightly enhanced contrast and depth, subtle fine film grain. Keep the building, the green 'PANTI ASUHAN' sign, the white banner, door, potted plants, bench, and ALL text completely unchanged and readable. Mood: dignified, warm, sentimental, hopeful, reverent. Do not add or remove any objects, people, or text. Preserve documentary realism.";

await Promise.all([
  enhance(
    "/home/z/my-project/upload/Screenshot_20-6-2026_151749_www.google.com.jpeg",
    "/home/z/my-project/public/images/house-real-street.png",
    PROMPT_STREET,
    "1440x720"
  ).catch((e) => console.error("street failed:", e.message)),
  enhance(
    "/home/z/my-project/upload/Screenshot_20-6-2026_171350_www.google.com.jpeg",
    "/home/z/my-project/public/images/house-real-facade.png",
    PROMPT_FACADE,
    "1344x768"
  ).catch((e) => console.error("facade failed:", e.message)),
]);

console.log("ALL DONE");
