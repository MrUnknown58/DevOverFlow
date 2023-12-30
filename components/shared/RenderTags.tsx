import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
interface TagProps {
  tag: {
    _id: number;
    count?: number;
    name: string;
  };
  showCount?: boolean;
}

const RenderTags = ({ tag: { _id, count, name }, showCount }: TagProps) => {
  return (
    <Link href={`/tag/${_id}`} className="flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{count}</p>
      )}
    </Link>
  );
};

export default RenderTags;
