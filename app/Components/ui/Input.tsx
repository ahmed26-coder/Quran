import React from "react";

export default function SectionTitle({
  title,
  type,
  description
}: {
  title: string;
  type: string;
  description: string;
}) {
  return (
    <div className=" space-y-2 mt-2">
        <p className=" text-xl font-medium ">{title}</p>
      <input className=" w-full border bg-gray-50 dark:bg-black border-gray-300 rounded-md outline-0 focus:border-emerald-600 py-2 px-3 " type={type} placeholder={description} />
    </div>
  );
}
