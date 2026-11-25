import { readFileSync } from "node:fs";

export const originalRun = new URL("../evidence/hour1/run.ndjson", import.meta.url);
export const originalPack = new URL("../evidence/hour1/36fae954-edb8-451e-8741-581e6cc4c36f.evidence", import.meta.url);
export const originalEnd = readFileSync(originalRun, "utf8").trim().split("\n").map(JSON.parse).at(-1);
export const quote = originalEnd.final_state.withdrawal_text;
export const faq = originalEnd.final_state.source_url;
export const homepage = new URL("/en/", faq).href;

// Synthetic run_end records use Kane's hour-1 shape and its actual captured fee text.
export function replayNdjson({ text = quote, url = faq, claim = 2, status = "passed", session = "fixture-recheck" } = {}) {
  const valueKey = `r${claim}`;
  const urlKey = `${valueKey}_url`;
  return JSON.stringify({
    type: "run_end",
    status,
    session_dir: `/fixtures/${session}`,
    run_id: originalEnd.run_id,
    final_state: { [valueKey]: text, [urlKey]: url },
    context: { memory: {
      [valueKey]: { ...originalEnd.context.memory.withdrawal_text, extracted_value: text },
      [urlKey]: { ...originalEnd.context.memory.source_url, extracted_value: url },
    } },
  }) + "\n";
}
