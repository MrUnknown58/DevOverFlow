import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionsByTagID } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";

const TagDetails = async ({ params, searchParams }: URLProps) => {
  const results = await getQuestionsByTagID({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams?.searchQuery,
  });
  const tagTitle = results?.tagTitle;
  const questions = results?.questions;
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>
      <div className="mt-11 w-full">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search Tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions && questions?.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question.id}
              _id={question.id}
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
          ))
        ) : (
          <NoResult
            title="There's no tag questions to show"
            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the
      discussion. our query could be the next big thing others learn from. Get
      involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default TagDetails;
