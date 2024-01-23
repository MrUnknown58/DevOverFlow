import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface QuestionsTabProps extends SearchParamsProps {
  clerkId?: string | null;
  userId: string;
}

const QuestionsTab = async ({
  searchParams,
  clerkId,
  userId,
}: QuestionsTabProps) => {
  const results = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {results.questions.map((question) => (
        <QuestionCard
          key={question.id}
          _id={question.id}
          clerkId={clerkId}
          title={question.title}
          description={question.content}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          answers={question.answers}
          answersCount={question.answers.length}
          views={question.views}
          createdAt={question.createdAt}
        />
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={results.isNext}
        />
      </div>
    </>
  );
};

export default QuestionsTab;
