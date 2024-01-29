import Link from "next/link";
import React from "react";
import RenderTags from "../shared/RenderTags";
import Metric from "../shared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface QuestionCardProps {
  _id: string;
  title: string;
  description: string;
  tags: {
    id: string;
    name: string;
  }[];
  author: {
    id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: {
    id: string;
    userId: string;
    answerId: string | null;
    questionId: string | null;
  }[];
  answersCount: number;
  answers: Array<object>;
  views: number;
  createdAt: Date;
  clerkId?: string | null;
}
const QuestionCard = ({
  _id,
  title,
  description,
  tags,
  author,
  upvotes,
  answersCount,
  answers,
  views,
  createdAt,
  clerkId,
}: QuestionCardProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  console.log(clerkId);
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {/* {console.log(createdAt)} */}
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* If signed in, add edit delete actions */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTags key={tag.id} id={tag.id} name={tag.name} />
        ))}
      </div>

      <div className="mt-6 flex w-full flex-wrap justify-between gap-3">
        <Metric
          imgUrl={author.picture}
          // imgUrl="/assets/icons/user.svg"
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          isAuthor
          href={`/profile/${author.clerkId}`}
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={upvotes.length}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            value={answers.length}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views"
            value={formatNumber(views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
