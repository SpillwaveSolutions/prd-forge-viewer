import DOMPurify from "dompurify";
import { marked } from "marked";

const remote = (url: string) => /^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith("data:");

/**
 * Render a section body to safe HTML (NFR-010). DOMPurify removes scripts and handlers. A local
 * image keeps its path in data-asset for read_asset to load; a remote image shows its alt text.
 * A remote link does not navigate, and a link to another document opens it in the viewer.
 */
export function renderBody(markdown: string, win: Window & typeof globalThis = window): string {
    const purify = DOMPurify(win);
    // Fail closed: without a working sanitizer, show the markdown as plain text.
    if (!purify.isSupported) {
        const pre = win.document.createElement("pre");
        pre.textContent = markdown;
        return pre.outerHTML;
    }
    const raw = marked.parse(markdown, { async: false, gfm: true }) as string;
    const clean = purify.sanitize(raw, { FORBID_TAGS: ["style", "iframe", "object", "embed", "form"], FORBID_ATTR: ["style"] });
    const doc = new win.DOMParser().parseFromString(`<div>${clean}</div>`, "text/html");
    const root = doc.body.firstElementChild!;
    for (const img of Array.from(root.querySelectorAll("img")) as HTMLImageElement[]) {
        const src = img.getAttribute("src") ?? "";
        if (remote(src)) {
            const span = doc.createElement("span");
            span.className = "image-blocked";
            span.textContent = `[image: ${img.getAttribute("alt") || "remote image"}]`;
            img.replaceWith(span);
        } else {
            img.setAttribute("data-asset", src.replace(/^\.\//, ""));
            img.removeAttribute("src");
        }
    }
    for (const a of Array.from(root.querySelectorAll("a")) as HTMLAnchorElement[]) {
        const href = a.getAttribute("href") ?? "";
        a.removeAttribute("href");
        if (remote(href)) a.className = "link-blocked";
        else if (/\.md(#.*)?$/.test(href)) a.setAttribute("data-doc", href.replace(/^\.\//, "").replace(/#.*$/, ""));
    }
    return root.innerHTML;
}
