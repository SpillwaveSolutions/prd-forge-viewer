// Minimal MCP client: start the tauri MCP server over stdio and call its tools.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "node_modules/@hypothesi/tauri-mcp-server");
const pkg = JSON.parse(await Bun.file(join(root, "package.json")).text());
const bin = typeof pkg.bin === "string" ? pkg.bin : Object.values(pkg.bin)[0];
export async function connect() {
  const transport = new StdioClientTransport({ command: "node", args: [join(root, bin)] });
  const client = new Client({ name: "prdf-test", version: "0.1.0" });
  await client.connect(transport);
  return client;
}
if (process.argv[2] === "tools") {
  const c = await connect();
  const { tools } = await c.listTools();
  for (const t of tools) console.log(t.name, "-", (t.description || "").split("\n")[0].slice(0, 110));
  await c.close();
}
