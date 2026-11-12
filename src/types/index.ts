export type Category =
  | "family"
  | "work"
  | "friends"
  | "school"
  | "vip"
  | "acquaintances"
  | "partners"
  | "other";

export interface Birthday {
  id: string;
  name: string;
  date: string;
  category: Category;
  createdAt: number;
  notes?: string;
}

export const CATEGORIES: {
  value: Category;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
}[] = [
  {
    value: "family",
    label: "Family",
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.15)",
    borderColor: "rgba(239,68,68,0.35)",
    emoji: "❤️",
  },
  {
    value: "work",
    label: "Work",
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.15)",
    borderColor: "rgba(59,130,246,0.35)",
    emoji: "💼",
  },
  {
    value: "friends",
    label: "Friends",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.15)",
    borderColor: "rgba(34,197,94,0.35)",
    emoji: "🤝",
  },
  {
    value: "school",
    label: "School",
    color: "#eab308",
    bgColor: "rgba(234,179,8,0.15)",
    borderColor: "rgba(234,179,8,0.35)",
    emoji: "🎓",
  },
  {
    value: "vip",
    label: "VIP",
    color: "#a855f7",
    bgColor: "rgba(168,85,247,0.15)",
    borderColor: "rgba(168,85,247,0.35)",
    emoji: "⭐",
  },
  {
    value: "acquaintances",
    label: "Acquaintances",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.15)",
    borderColor: "rgba(249,115,22,0.35)",
    emoji: "👋",
  },
  {
    value: "partners",
    label: "Partners",
    color: "#ec4899",
    bgColor: "rgba(236,72,153,0.15)",
    borderColor: "rgba(236,72,153,0.35)",
    emoji: "💖",
  },
  {
    value: "other",
    label: "Other",
    color: "#9ca3af",
    bgColor: "rgba(156,163,175,0.15)",
    borderColor: "rgba(156,163,175,0.35)",
    emoji: "📌",
  },
];

export function getCategoryConfig(category: Category) {
  return CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[7];
}
