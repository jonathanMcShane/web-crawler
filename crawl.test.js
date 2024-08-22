import { test, expect } from "@jest/globals"
import { normalizeURL } from "./crawl.js"

test('Removes protocol and returns just the domain', () => {
    expect(normalizeURL('https://google.com')).toBe('google.com');
});