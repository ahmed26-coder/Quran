import React from "react";

export default function SectionTitle({
  title,
  description
}: {
  title: string;
  description?: string
}) {
  return (
    <div className="px-4 max-w-3xl mx-auto">
      <p className="text-center text-black dark:text-white text-3xl sm:text-5xl font-bold  my-4">
        {title}
      </p>
      <p className="text-center text-gray-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
        {description}
      </p>
    </div>
  );
}
