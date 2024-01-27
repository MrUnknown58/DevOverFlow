import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "AskMakers | Home",
  description:
    "AskMakers is a Q&A platform for Makers. Ask questions, get answers, and share your knowledge with the community. Here, you can find all the questions and answers related to the maker community and products built by them and for them to help you build your next big thing.",
};
const Home = async ({ searchParams }: SearchParamsProps) => {
  let results;
  const { userId } = auth();
  if (searchParams?.filter === "recommended") {
    if (userId) {
      results = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q || "",
        page: searchParams.page ? +searchParams.page : 1,
      });
    } else {
      results = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    results = await getQuestions({
      filter: searchParams.filter,
      searchQuery: searchParams.q || "",
      page: searchParams.page ? +searchParams.page : 1,
    });
  }
  const questions = results?.questions;
  // const isLoading = true;
  // if (isLoading) return <Loading />;
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-3 py-4 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

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
            title="There's no questions to show"
            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={results?.isNext || false}
        />
      </div>
    </>
  );
};

export default Home;
