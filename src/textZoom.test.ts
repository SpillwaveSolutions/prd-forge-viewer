import { expect, test } from "bun:test";
import { nextZoom, readZoom } from "./textZoom";

test("each_step_makes_the_text_larger_or_smaller_and_stops_at_the_ends", () => {
    expect(nextZoom(1, 1)).toBe(1.15);
    expect(nextZoom(1, -1)).toBe(0.9);
    expect(nextZoom(2, 1)).toBe(2);
    expect(nextZoom(0.8, -1)).toBe(0.8);
    expect(nextZoom(1.5, 0)).toBe(1);
});

test("a_value_between_steps_moves_to_the_next_step", () => {
    expect(nextZoom(1.2, 1)).toBe(1.3);
    expect(nextZoom(1.2, -1)).toBe(1.15);
});

test("a_stored_value_is_used_only_when_it_is_a_step", () => {
    expect(readZoom("1.3")).toBe(1.3);
    expect(readZoom("7")).toBe(1);
    expect(readZoom(null)).toBe(1);
    expect(readZoom("abc")).toBe(1);
});
