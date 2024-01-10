import Link from "next/link";
import React from "react";
import RenderTags from "../shared/RenderTags";
import Metric from "../shared/Metric";

interface QuestionCardProps {
  _id: string;
  title: string;
  description: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  answersCount: number;
  answers: Array<object>;
  views: number;
  createdAt: Date;
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
}: QuestionCardProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {String(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* If signed in, add edit delete actions */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTags key={tag._id} tag={tag} />
        ))}
      </div>

      <div className="mt-6 flex w-full flex-wrap justify-between gap-3">
        <Metric
          // imgUrl={author.picture}
          imgUrl="/assets/icons/user.svg"
          alt="user"
          value={author.name}
          title=" - asked 1 hour ago"
          isAuthor
          href={`/profile/${author._id}`}
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={upvotes}
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
          value={views}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
