import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

async function makeTexture() {
  const input = "/home/z/my-project/upload/pasted_image_1781964517806.png";
  const buf = fs.readFileSync(input);
  const b64 = buf.toString("base64");
  const dataUrl = `data:image/png;base64,${b64}`;

  const zai = await ZAI.create();
  console.log("Creating seamless parchment texture...");
  const res = await zai.images.generations.edit({
    prompt:
      "Transform this image into a SEAMLESS flat parchment paper texture. Remove the rolled scroll cylinders at top and bottom entirely. Remove all torn/jagged edges. Crop to ONLY the flat central parchment surface. Make it a uniform, tileable, edge-to-edge aged parchment texture with warm tan/sepia/amber tones, subtle fiber grain, faint age spots, and gentle tonal variation — but NO scroll rolls, NO borders, NO margins, NO single-object framing. It must look like a continuous sheet of old paper that can repeat seamlessly as a website background. Preserve the authentic aged-paper color and fiber texture.",
    images: [{ url: dataUrl }],
    size: "1024x1024",
  });
  const out = res.data[0].base64;
  const output = "/home/z/my-project/public/images/parchment-texture.png";
  fs.writeFileSync(output, Buffer.from(out, "base64"));
  console.log(`✓ Saved ${output} (${fs.statSync(output).size} bytes)`);
}

makeTexture().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
