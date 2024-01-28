import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | AskMakers",
  description: "Here, you can find all the tags.",
};

const Tags = async ({ searchParams }: SearchParamsProps) => {
  const response = await getAllTags({
    searchQuery: searchParams.q || "",
    filter: searchParams.filter || "",
    page: searchParams.page ? +searchParams.page : 1,
  });
  const tags = response.tags;
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="right"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {tags && tags?.length > 0 ? (
          tags.map((tag) => (
            <Link
              href={`/tags/${tag.id}`}
              key={tag.id}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questionId.length}+
                  </span>
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags Found"
            desc="Looks like there are no tags found"
            link="/ask-question"
            linkText="Ask a question"
          />
        )}
      </section>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={response.isNext}
        />
      </div>
    </>
  );
};

export default Tags;
