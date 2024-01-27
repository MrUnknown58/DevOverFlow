import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTags from "@/components/shared/RenderTags";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question | AskMakers",
  description: "Here, you can find all the question details.",
};

const Question = async ({ params, searchParams }: any) => {
  //   console.log(params);
  const question = await getQuestionById({ questionId: params.id });
  //   const answers = await getAnswers({ questionId: params.id });
  //   console.log(question);
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const user = await getUserById({ userId });
  if (!user) redirect("/sign-in");
  if (!question) return <></>;
  // console.log(question);
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question?.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.stringify(question.id)}
              userId={JSON.stringify(user.id)}
              upvotes={question.upvotes.length}
              hasUpvoted={
                question.upvotes.filter((v) => v.userId === user.id).length > 0
              }
              downvotes={question.downvotes.length}
              hasDownvoted={
                question.downvotes.filter((v) => v.userId === user.id).length >
                0
              }
              hasSaved={user.savedQuestionId.includes(question.id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="clock icon"
            value={` asked ${getTimeStamp(question.createdAt)}`}
            title=" "
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            value={question.answerIds.length}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views"
            value={formatNumber(question.views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
      <ParseHTML data={question.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <RenderTags key={tag.id} id={tag.id} name={tag.name} />
        ))}
      </div>

      <AllAnswers
        questionId={question.id}
        userId={JSON.stringify(user.id)}
        totalAnswers={question.answerIds.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />
      <Answer
        question={question.content}
        questionId={JSON.stringify(question.id)}
        userId={JSON.stringify(user.id)}
      />
    </>
  );
};

export default Question;
