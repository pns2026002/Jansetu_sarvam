import { IncidentRecord, InventoryItem } from "@/types/incident";

export const MOCK_INVENTORY: InventoryItem[] = [
  { type: "rescue_boat", name: "Inflatable Rescue Boat", available: 4, unit: "boats" },
  { type: "ambulance", name: "Emergency Ambulance Unit", available: 3, unit: "vehicles" },
  { type: "medical_kit", name: "Trauma & First Aid Kit", available: 15, unit: "kits" },
  { type: "food_package", name: "Emergency Food & Water Pack", available: 100, unit: "rations" },
  { type: "rescue_team", name: "NDRF / Volunteer Rescue Team", available: 5, unit: "teams" },
];

export const SEEDED_INCIDENTS: IncidentRecord[] = [
  {
    id: "INC-2026-0891",
    timestamp: "2026-10-24T15:42:00Z",
    original_text: "सर, हमारे गाँव में पानी भर रहा है। स्कूल के पास लगभग 20 लोग फँसे हुए हैं। बिजली भी नहीं है।",
    language: "hi",
    is_demo: true,
    review_status: "needs_verification",
    tokens_used: {
      prompt_tokens: 312,
      completion_tokens: 184,
      total_tokens: 496,
    },
    analysis: {
      category: "flooding",
      summary: "Severe flooding reported near village school with approx 20 people stranded and power cut.",
      location: {
        value: "Near village school (exact village unspecified)",
        status: "reported",
      },
      people_affected: {
        value: "Approximately 20 people (unverified citizen report)",
        status: "reported",
      },
      severity: "high",
      confidence: 0.82,
      missing_information: [
        "Exact village name / GPS coordinates",
        "Water depth and access road conditions",
        "Presence of children, elderly, or injured persons",
      ],
      recommended_actions: [
        "Initiate emergency callback to verify exact village and water level",
        "Alert nearest flood rescue post with boat capacity",
        "Coordinate with local power utility on electrical hazards",
      ],
      resource_requirements: [
        { type: "rescue_boat", quantity: 2, reason: "Evacuation of ~20 stranded citizens" },
        { type: "rescue_team", quantity: 1, reason: "Water rescue operation crew" },
        { type: "food_package", quantity: 25, reason: "Immediate rations for stranded group" },
      ],
      citizen_response: "आपकी सूचना दर्ज कर ली गई है। कृपया सुरक्षित ऊँचे स्थान पर रहें और बिजली के तारों से दूर रहें। हमारी टीम सत्यापन कर रही है।",
    },
  },
  {
    id: "INC-2026-0892",
    timestamp: "2026-10-24T15:58:00Z",
    original_text: "Highway 44 bypass near vegetable market - truck and car collision. 2 people injured and bleeding, need ambulance immediately. Road blocked.",
    language: "en",
    is_demo: true,
    review_status: "unreviewed",
    tokens_used: {
      prompt_tokens: 295,
      completion_tokens: 168,
      total_tokens: 463,
    },
    analysis: {
      category: "road_accident",
      summary: "Truck and car collision on Highway 44 bypass near vegetable market; 2 injured and road blocked.",
      location: {
        value: "Highway 44 bypass near vegetable market",
        status: "reported",
      },
      people_affected: {
        value: "2 injured individuals reported",
        status: "reported",
      },
      severity: "critical",
      confidence: 0.91,
      missing_information: [
        "Current vitals/consciousness of injured persons",
        "Severity of vehicle entrapment",
      ],
      recommended_actions: [
        "Dispatch emergency trauma ambulance to Highway 44 bypass",
        "Alert local traffic police to clear bottleneck for emergency transit",
        "Prepare nearest district trauma care ward",
      ],
      resource_requirements: [
        { type: "ambulance", quantity: 2, reason: "Trauma transit for 2 bleeding casualties" },
        { type: "medical_kit", quantity: 2, reason: "Immediate roadside hemorrhage control" },
      ],
      citizen_response: "Incident logged. Emergency ambulance dispatched to Highway 44 bypass. Keep the injured calm and do not move them unless danger of fire.",
    },
  },
  {
    id: "INC-2026-0893",
    timestamp: "2026-10-24T16:05:00Z",
    original_text: "Ward 7 area has had a complete blackout for 4 hours. Water pump stations have stopped working and senior citizens need assistance.",
    language: "en",
    is_demo: true,
    review_status: "reviewed",
    reviewed_at: "2026-10-24T16:10:00Z",
    tokens_used: {
      prompt_tokens: 280,
      completion_tokens: 145,
      total_tokens: 425,
    },
    analysis: {
      category: "power_outage",
      summary: "Extended 4-hour blackout in Ward 7 disrupting community water pump stations and affecting vulnerable seniors.",
      location: {
        value: "Ward 7 municipal sector (exact sub-blocks unknown)",
        status: "inferred",
      },
      people_affected: {
        value: "Multiple households and elderly residents (exact count unknown)",
        status: "unknown",
      },
      severity: "medium",
      confidence: 0.78,
      missing_information: [
        "Sub-station ID or transformer sector number",
        "Estimated restoration time from electricity board",
      ],
      recommended_actions: [
        "Relay grid fault alert to municipal power board control room",
        "Mobilize civil defense volunteer check on registered elderly residents",
        "Inspect backup generator status at primary water booster station",
      ],
      resource_requirements: [
        { type: "rescue_team", quantity: 1, reason: "Welfare check and water delivery" },
      ],
      citizen_response: "Report received. Electricity board operations desk notified regarding Ward 7 outage.",
    },
  },
];

export const SAMPLE_PROMPTS = [
  {
    label: "बाढ़ की सूचना (Hindi Flood)",
    lang: "hi" as const,
    text: "सर, हमारे गाँव में पानी भर रहा है। स्कूल के पास लगभग 20 लोग फँसे हुए हैं। बिजली भी नहीं है।",
  },
  {
    label: "सड़क दुर्घटना (Highway Collision)",
    lang: "en" as const,
    text: "Highway 44 bypass near vegetable market - truck and car collision. 2 people injured and bleeding, need ambulance immediately. Road blocked.",
  },
  {
    label: "बिजली और पानी संकट (Ward Blackout)",
    lang: "en" as const,
    text: "Ward 7 area has had a complete blackout for 4 hours. Water pump stations have stopped working and senior citizens need assistance.",
  },
];
