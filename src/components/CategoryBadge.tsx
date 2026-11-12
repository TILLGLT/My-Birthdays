import { getCategoryConfig } from "../types";
import type { Category } from "../types";

interface Props {
  category: Category;
  size?: "sm" | "md";
}

export default function CategoryBadge({ category, size = "sm" }: Props) {
  const config = getCategoryConfig(category);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
