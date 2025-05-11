interface SectionTitleProps {
  title: string;
  types?: "button" | "reset" | "submit";
  highlighted?: boolean;
  icon?: React.ReactNode;
}

export default function SectionTitle({
  title,
  types = "button",
  highlighted,
  icon,
}: SectionTitleProps) {
  return (
    <button
      type={types}
      className={`flex items-center border-1 border-gray-300 justify-center gap-2 rounded-md px-3 py-1.5 text-base w-full mx-auto ${highlighted
          ? "text-white bg-emerald-600 hover:bg-emerald-700"
          : "bg-white text-black hover:bg-gray-50/90 "
        }`}
    >
      {title}
      {icon && <span className="icon">{icon}</span>}
    </button>
  );
}
