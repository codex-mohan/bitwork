"use client";
import { Bookmark, HandHelping, IndianRupee, MapPin } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";

interface JobProps {
  title: string;
  requesterName: string;
  avatarUrl: string;
  description: string;
  budget: string;
  location: string;
  isClosed?: boolean;
}

const JobCard: React.FC<JobProps> = ({
  title,
  requesterName,
  avatarUrl,
  description,
  budget,
  location,
  isClosed = false,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-400 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
          <div className="relative h-12 w-12">
            {" "}
            <Image
              alt={requesterName}
              className="object-cover"
              fill
              src={avatarUrl}
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-zinc-900 leading-tight">
            {title}
          </h3>
          <p className="font-medium text-sm text-zinc-500">{requesterName}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 font-bold text-xs text-zinc-800">
          <IndianRupee className="text-zinc-600" size={14} />
          {budget}
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 font-semibold text-xs text-zinc-700">
          <MapPin className="text-zinc-500" size={14} />
          {location}
        </div>
      </div>

      <p className="mt-4 line-clamp-3 h-15 text-sm text-zinc-600 leading-relaxed">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-between">
        <button
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-bold text-sm transition-all ${
            isSaved
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
          }`}
          onClick={() => setIsSaved(!isSaved)}
          type="button"
        >
          <Bookmark fill={isSaved ? "currentColor" : "none"} size={16} />
          {isSaved ? "Saved" : "Save"}
        </button>

        <button
          className={`flex items-center gap-2 rounded-lg px-5 py-2 font-bold text-sm transition-all ${
            isClosed
              ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
              : "bg-zinc-950 text-white hover:bg-zinc-800 active:scale-95"
          }`}
          disabled={isClosed}
          type="button"
        >
          {isClosed ? "Closed" : "Help Now"}
          {!isClosed && <HandHelping size={16} />}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
