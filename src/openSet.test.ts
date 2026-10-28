import { expect, test } from "bun:test";
import { openSet } from "./openSet";
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
