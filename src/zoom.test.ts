import { expect, test } from "bun:test";
import { fitView, zoomAt } from "./zoom";

test("a_diagram_opens_fitted_and_centered", () => {
    expect(fitView({ width: 2000, height: 500 }, { width: 1000, height: 800 })).toEqual({ scale: 0.475, x: 25, y: 281.25 });
    // A small diagram is made larger, to fill the window.
    expect(fitView({ width: 200, height: 100 }, { width: 1000, height: 800 })).toEqual({ scale: 4.75, x: 25, y: 162.5 });
});

test("zoom_keeps_the_point_under_the_pointer_still", () => {
    const v = zoomAt({ scale: 1, x: 0, y: 0 }, 2, 100, 50);
    expect(v).toEqual({ scale: 2, x: -100, y: -50 });
    // The content point under the pointer is the same before and after.
    expect((100 - v.x) / v.scale).toBe(100);
});

test("zoom_stops_at_0_25_and_8", () => {
    expect(zoomAt({ scale: 6, x: 0, y: 0 }, 4, 0, 0).scale).toBe(8);
    expect(zoomAt({ scale: 0.5, x: 0, y: 0 }, 0.1, 0, 0).scale).toBe(0.25);
});

test("a_very_large_diagram_opens_at_the_25_percent_minimum", () => {
    expect(fitView({ width: 10000, height: 100 }, { width: 1000, height: 800 }).scale).toBe(0.25);
});
