import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import Filter from "@/components/shared/Filter";
import { auth } from "@clerk/nextjs";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Collections = async () => {
  const { userId } = auth();
  if (!userId) redirect("/");
  const questions = await getSavedQuestions({ clerkId: userId });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
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
            title="There's no saved questions to show"
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

export default Collections;
