/**
 * Frontend-owned id → display mapping (decision D1: RU labels live on the
 * frontend, not in backend state). Backend `AgentState` only carries `id`
 * and an English `name` (Step 0 contract) — role/color/RU display name are
 * looked up here by id.
 */

export type AgentRole = {
  displayName: string;
  role: string;
  color: string;
};

export const AGENT_ROLES: Record<string, AgentRole> = {
  alice: { displayName: "Алиса", role: "Координатор", color: "#4f5bd5" },
  bob: { displayName: "Боб", role: "Ресёрчер", color: "#7c3aed" },
};

const FALLBACK_COLOR = "#8a91ab";

/** Unknown ids (e.g. future hires) fall back to a grey badge with id as name. */
export function getAgentRole(id: string): AgentRole {
  return AGENT_ROLES[id] ?? { displayName: id, role: "", color: FALLBACK_COLOR };
}
