import React from "react";

export default function SectionTitle({
  headline,
  title,
  description,
  highlighted
}: {
  headline?: string;
  title: string;
  description?: string;
  highlighted?: boolean;
}) {
  return (
    <div className="px-4 max-w-3xl mx-auto">
      <p className={`bg-emerald-200/50 rounded-lg text-sm w-fit mx-auto ${highlighted ? "px-3 py-1" : "px-0 py-0"}`}>
        {headline}
      </p>
      <p className="text-center text-3xl sm:text-5xl font-bold text-accent my-4">
        {title}
      </p>
      <p className="text-center text-gray-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
        {description}
      </p>
    </div>
  );
}
