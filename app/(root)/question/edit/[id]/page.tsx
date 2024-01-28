import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Question | AskMakers",
  description: "Here, you can edit your question.",
};

const EditQuestion = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  // console.log(userId);
  if (!userId) redirect("/sign-in");
  const user = await getUserById({ userId });
  console.log(params.id);
  const questionDetails = await getQuestionById({
    questionId: params.id,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="edit"
          userDetails={JSON.stringify(user?.id)}
          questionDetails={JSON.stringify(questionDetails)}
        />
      </div>
    </>
  );
};

export default EditQuestion;
