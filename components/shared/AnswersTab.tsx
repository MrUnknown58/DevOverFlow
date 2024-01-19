import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";

interface AnswersTabProps extends SearchParamsProps {
  clerkId?: string | null;
  userId: string;
}

const AnswersTab = async ({
  clerkId,
  userId,
  searchParams,
}: AnswersTabProps) => {
  const result = await getUserAnswers({ userId, page: 1 });
  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer.id}
          clerkId={clerkId}
          id={answer.id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};

export default AnswersTab;
