// Bundle the UI into dist/ and write dist/index.html, as Motion's build does.
import { cpSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dir, "..");
const DIST = join(ROOT, "dist");

async function build() {
    rmSync(DIST, { recursive: true, force: true });
    const result = await Bun.build({
        entrypoints: [join(ROOT, "src/main.tsx")],
        outdir: DIST,
        target: "browser",
        format: "esm",
        minify: true,
        // The e2e hooks for the save and print dialogs exist only in the MCP test build.
        define: { "process.env.NODE_ENV": '"production"', __PFV_E2E__: String(process.argv.includes("--e2e")) },
    });
    if (!result.success) {
        for (const log of result.logs) console.error(log);
        throw new Error("build failed");
    }
    cpSync(join(ROOT, "public"), DIST, { recursive: true });
    const name = (p: string) => p.split("/").pop();
    const js = result.outputs.find((o) => o.path.endsWith(".js"));
    const css = result.outputs.find((o) => o.path.endsWith(".css"));
    if (!js) throw new Error("build produced no JS entry point");
    writeFileSync(
        join(DIST, "index.html"),
        `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PRD Forge Viewer</title>
${css ? `<link rel="stylesheet" href="./${name(css.path)}">` : ""}
</head>
<body>
<div id="root"></div>
<script type="module" src="./${name(js.path)}"></script>
</body>
</html>
`,
    );
    console.log(`dist/ built: index.html, ${name(js.path)}`);
}

await build();
if (process.argv.includes("--watch")) {
    const { watch } = await import("fs");
    watch(join(ROOT, "src"), { recursive: true }, () => build().catch(console.error));
}
