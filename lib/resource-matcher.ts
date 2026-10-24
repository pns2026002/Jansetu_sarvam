import { ResourceRequirement, ResourceAllocationMatch, InventoryItem } from "@/types/incident";
import { MOCK_INVENTORY } from "./demo-data";

export function matchResources(
  requirements: ResourceRequirement[],
  inventory: InventoryItem[] = MOCK_INVENTORY
): ResourceAllocationMatch[] {
  if (!requirements || requirements.length === 0) {
    return [];
  }

  return requirements.map((req) => {
    const normalizedType = req.type.trim().toLowerCase().replace(/\s+/g, "_");
    const item = inventory.find(
      (x) => x.type.toLowerCase() === normalizedType || normalizedType.includes(x.type.toLowerCase())
    );

    const requested = Math.max(0, Math.floor(req.quantity || 1));

    if (!item) {
      return {
        type: req.type,
        requested,
        available: 0,
        suggested: 0,
        shortfall: requested,
        status: "unsupported" as const,
        reason: req.reason || "Resource type not in standard emergency inventory - requires manual coordination",
      };
    }

    const available = item.available;
    const suggested = Math.min(requested, available);
    const shortfall = Math.max(0, requested - available);

    return {
      type: item.type,
      requested,
      available,
      suggested,
      shortfall,
      status: shortfall === 0 ? ("available" as const) : ("shortfall" as const),
      reason: req.reason,
    };
  });
}
