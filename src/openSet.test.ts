import { expect, test } from "bun:test";
import { applyResult, applyStart, openSet } from "./openSet";
import { sampleSet } from "./fixtures";

test("cancel_gives_nothing", async () => {
    expect(await openSet(async () => null, async () => sampleSet([]))).toEqual({});
});

test("success_gives_set", async () => {
    const set = sampleSet([]);
    expect(await openSet(async () => "/tmp/set", async () => set)).toEqual({ set });
});

test("failure_gives_message", async () => {
    const r = await openSet(async () => "/tmp/empty", async () => {
        throw "No PRD set in /tmp/empty: prd.md was not found.";
    });
    expect(r).toEqual({ error: "No PRD set in /tmp/empty: prd.md was not found." });
});

test("error_clears_the_old_set", () => {
    expect(applyResult(sampleSet([]), { error: "No PRD set in /tmp/empty: prd.md was not found." })).toEqual({
        set: undefined,
        error: "No PRD set in /tmp/empty: prd.md was not found.",
    });
});

test("cancel_keeps_the_old_set", () => {
    const set = sampleSet([]);
    expect(applyResult(set, {})).toEqual({ set, error: undefined });
});

test("start_screen_clears_set_and_error", () => {
    const view = { kind: "notFound" as const, folder: "/work", known: [] };
    expect(applyStart(view)).toEqual({ set: undefined, error: undefined, start: view });
});
