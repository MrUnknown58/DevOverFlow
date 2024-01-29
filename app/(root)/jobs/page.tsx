import JobCard from "@/components/cards/JobCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { fetchJobs, getUserCountry } from "@/lib/actions/job.action";
import { Job, SearchParamsProps } from "@/types";

const Jobs = async ({ searchParams }: SearchParamsProps) => {
  const userLocation = await getUserCountry();
  const query =
    searchParams.q && searchParams.filter
      ? `${searchParams.q}, ${searchParams.filter}`
      : searchParams.q ||
        searchParams.filter ||
        `Software Engineer in ${userLocation.userLocation.country_name}`;
  const jobs = await fetchJobs({
    page: searchParams.page ? searchParams.page : "1",
    query,
  });
  const page = searchParams.page ? +searchParams.page : 1;
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/jobs"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Job Title, Company, or Keywords"
          otherClasses="flex-1"
        />
        <Filter
          filters={userLocation.cities}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
          userLocation={userLocation.userLocation.country_name}
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {jobs && jobs?.length > 0 ? (
          jobs.map((job: Job) => {
            if (job.job_title && job.job_title.toLowerCase() !== "undefined")
              return <JobCard key={job.id} job={job} />;

            return null;
          })
        ) : (
          <p className="paragraph-regular text-dark200_light800 w-full text-center">
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later
          </p>
        )}
      </div>
      {jobs && jobs.length > 0 && (
        <Pagination pageNumber={page} isNext={jobs.length === 10} />
      )}
    </>
  );
};

export default Jobs;
