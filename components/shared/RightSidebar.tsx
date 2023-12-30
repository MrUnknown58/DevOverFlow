import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTags from "./RenderTags";

const hotQuestions = [
  {
    _id: 1,
    title: "What are the new features in NextJS 14?",
    votes: 10,
    answers: 5,
  },
  {
    _id: 2,
    title: "How to upgrade to NextJS 14?",
    votes: 10,
    answers: 5,
  },
  {
    _id: 3,
    title: "What are the best practices for NextJS 14?",
    votes: 10,
    answers: 5,
  },
  {
    _id: 4,
    title: "How to handle routing in NextJS 14?",
    votes: 10,
    answers: 5,
  },
  {
    _id: 5,
    title: "How to optimize performance in NextJS 14?",
    votes: 10,
    answers: 5,
  },
];
const popularTags = [
  {
    _id: 1,
    name: "NextJS",
    count: 10,
  },
  {
    _id: 2,
    name: "ReactJS",
    count: 10,
  },
  {
    _id: 3,
    name: "JavaScript",
    count: 10,
  },
  {
    _id: 4,
    name: "TypeScript",
    count: 10,
  },
  {
    _id: 5,
    name: "GraphQL",
    count: 10,
  },
  {
    _id: 6,
    name: "Apollo",
    count: 10,
  },
  {
    _id: 7,
    name: "Prisma",
    count: 10,
  },
  {
    _id: 8,
    name: "MongoDB",
    count: 10,
  },
  {
    _id: 9,
    name: "PostgreSQL",
    count: 10,
  },
  {
    _id: 10,
    name: "MySQL",
    count: 10,
  },
];
const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`/questions/${question._id}`}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron-right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTags key={tag._id} tag={tag} showCount />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
