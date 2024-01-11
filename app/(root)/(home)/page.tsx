import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";

const questions = [
  {
    _id: "1",
    title: "How to use TypeScript?",
    description:
      "I'm new to TypeScript. Can anyone guide me on how to get started?",
    tags: [
      {
        _id: "1",
        name: "TypeScript",
      },
      {
        _id: "2",
        name: "JavaScript",
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      picture: "https://example.com/john.jpg",
    },
    upvotes: 10,
    answersCount: 2,
    answers: [
      {
        _id: "1",
        text: "You can start by reading the TypeScript documentation.",
        author: {
          _id: "2",
          name: "Jane Doe",
          picture: "https://example.com/jane.jpg",
        },
      },
      {
        _id: "2",
        text: "There are also many great tutorials on YouTube.",
        author: {
          _id: "3",
          name: "Bob Smith",
          picture: "https://example.com/bob.jpg",
        },
      },
    ],
    views: 1500000,
    createdAt: new Date("2023-12-28T08:46:04.085Z"),
  },
  {
    _id: "2",
    title: "What is the difference between == and === in JavaScript?",
    description:
      "Can someone explain the difference between == and === in JavaScript?",
    tags: [
      {
        _id: "2",
        name: "JavaScript",
      },
    ],
    author: {
      _id: "2",
      name: "Jane Doe",
      picture: "https://example.com/jane.jpg",
    },
    upvotes: 20,
    answersCount: 3,
    answers: [
      {
        _id: "3",
        text: "== checks for equality with type coercion, while === checks for equality without type coercion.",
        author: {
          _id: "1",
          name: "John Doe",
          picture: "https://example.com/john.jpg",
        },
      },
      {
        _id: "4",
        text: "In other words, == will convert the operands to the same type before making the comparison, while === will not.",
        author: {
          _id: "3",
          name: "Bob Smith",
          picture: "https://example.com/bob.jpg",
        },
      },
      {
        _id: "5",
        text: "For example, '5' == 5 will return true, but '5' === 5 will return false.",
        author: {
          _id: "4",
          name: "Alice Johnson",
          picture: "https://example.com/alice.jpg",
        },
      },
    ],
    views: 200,
    createdAt: new Date(),
  },
  {
    _id: "3",
    title: "How can I make a POST request with Axios?",
    description:
      "I'm trying to make a POST request with Axios in a React app. Can anyone help?",
    tags: [
      {
        _id: "3",
        name: "React",
      },
      {
        _id: "4",
        name: "Axios",
      },
    ],
    author: {
      _id: "3",
      name: "Bob Smith",
      picture: "https://example.com/bob.jpg",
    },
    upvotes: 15,
    answersCount: 1,
    answers: [
      {
        _id: "6",
        text: "You can use the axios.post method. Here's an example: axios.post('/api/url', { data }).then(response => { console.log(response); }).catch(error => { console.log(error); });",
        author: {
          _id: "1",
          name: "John Doe",
          picture: "https://example.com/john.jpg",
        },
      },
    ],
    views: 150,
    createdAt: new Date(),
  },
  // More questions...
];

const Home = () => {
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
        {questions?.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              description={question.description}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              answers={question.answers}
              answersCount={question.answersCount}
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
    </>
  );
};

export default Home;
