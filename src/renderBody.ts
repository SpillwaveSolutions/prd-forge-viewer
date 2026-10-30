import DOMPurify from "dompurify";
import { Marked, type Tokens } from "marked";
import { cleanBody } from "./bodyClean";

const remote = (url: string) => /^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith("data:");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const docOf = (href: string) => (/\.md(#.*)?$/.test(href) && !remote(href) ? href.replace(/^\.\//, "").replace(/#.*$/, "") : null);

// Markdown images and links are rewritten as they render: a local image waits for read_asset, a
// remote image is its alt text, a link to a document is a button, and any other link is text.
const md = new Marked({ gfm: true }).use({
    renderer: {
        image({ href, text }: Tokens.Image) {
            return remote(href) ? `<span class="image-blocked">[image: ${esc(text || "remote image")}]</span>` : `<img data-asset="${esc(href.replace(/^\.\//, ""))}" alt="${esc(text)}">`;
        },
        link(this: { parser: { parseInline(t: Tokens.Generic[]): string } }, { href, tokens }: Tokens.Link) {
            const label = this.parser.parseInline(tokens);
            const doc = docOf(href);
            if (doc) return `<button type="button" class="doc-link" data-doc="${esc(doc)}">${label}</button>`;
            return `<span class="${remote(href) ? "link-blocked" : "link"}">${label}</span>`;
        },
    },
});

const FORBID_TAGS = ["style", "iframe", "object", "embed", "form", "input", "video", "audio", "source", "picture", "track", "link", "meta", "base"];
const FORBID_ATTR = ["style", "srcset", "background", "poster", "action", "formaction", "ping", "xlink:href"];

/**
 * Render a section body to safe HTML (NFR-010). DOMPurify removes scripts, handlers, SVG, MathML,
 * and every tag or attribute that can load a remote file. Raw HTML images and links are rewritten in
 * the sanitizer's own hook, so its output is never changed afterwards.
 */
export function renderBody(markdown: string, win: Window & typeof globalThis = window): string {
    const purify = DOMPurify(win);
    // Fail closed: without a working sanitizer, show the markdown as plain text.
    if (!purify.isSupported) {
        const pre = win.document.createElement("pre");
        pre.textContent = markdown;
        return pre.outerHTML;
    }
    purify.addHook("afterSanitizeAttributes", (node) => {
        if (node.nodeName === "IMG") {
            const src = node.getAttribute("src");
            node.removeAttribute("src");
            if (src && !remote(src)) node.setAttribute("data-asset", src.replace(/^\.\//, ""));
        }
        if (node.nodeName === "A") node.removeAttribute("href");
    });
    try {
        return purify.sanitize(md.parse(cleanBody(markdown), { async: false }) as string, { USE_PROFILES: { html: true }, FORBID_TAGS, FORBID_ATTR });
    } finally {
        purify.removeAllHooks();
    }
}
