import { expect, test } from "bun:test";
import { JSDOM } from "jsdom";
import { renderBody } from "./renderBody";

const win = new JSDOM("").window as unknown as Window & typeof globalThis;

test("script_and_handlers_removed", () => {
    const html = renderBody('# T\n\n<script>alert(1)</script>\n\n<img src="x.png" onerror="alert(2)">', win);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
});

test("local_image_marked_for_loading", () => {
    const html = renderBody("![SC-001 scenario](diagrams/SC-001.svg)", win);
    expect(html).toContain('data-asset="diagrams/SC-001.svg"');
    expect(html).not.toContain('src="diagrams/SC-001.svg"');
});

test("remote_image_becomes_alt_text", () => {
    const html = renderBody("![a logo](https://example.com/logo.png)", win);
    expect(html).not.toContain("example.com");
    expect(html).toContain("a logo");
    expect(html).not.toContain("<img");
});

test("remote_link_does_not_navigate", () => {
    const html = renderBody("[site](https://example.com)", win);
    expect(html).not.toContain('href="https://example.com"');
    expect(html).toContain("site");
});

test("link_to_a_document_is_a_focusable_button", () => {
    const html = renderBody("[Scope](./07-scope.md)", win);
    expect(html).toMatch(/<button[^>]*data-doc="07-scope.md"[^>]*>Scope<\/button>/);
});

test("every_remote_load_path_is_removed", () => {
    const md = [
        '<img src="local.png" srcset="https://example.com/a.png 1x">',
        '<picture><source srcset="https://example.com/b.png"><img src="c.png"></picture>',
        '<svg><image href="https://example.com/d.png"/></svg>',
        '<table background="https://example.com/e.png"><tr><td background="https://example.com/f.png">x</td></tr></table>',
        '<video poster="https://example.com/g.png" src="https://example.com/h.mp4"></video>',
        '<audio src="https://example.com/i.mp3"></audio>',
        '<input type="image" src="https://example.com/j.png">',
        '<img src="https://example.com/k.png" alt="raw">',
        '<a href="https://example.com/l">raw link</a>',
    ].join("\n\n");
    const html = renderBody(md, win);
    expect(html).not.toContain("example.com");
});

test("no_sanitizer_fails_closed", () => {
    const html = renderBody("<script>alert(1)</script>", { document: win.document } as unknown as Window & typeof globalThis);
    expect(html).toBe("<pre>&lt;script&gt;alert(1)&lt;/script&gt;</pre>");
});
