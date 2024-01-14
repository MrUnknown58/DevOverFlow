import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  // const user = await getUserById({ userId });
  const user = await getUserById({ userId: "65a3907d508f5ac91c3df267" });
  // console.log(user);
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question userDetails={JSON.stringify(user?.id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
