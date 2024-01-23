import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

const Community = async ({ searchParams }: SearchParamsProps) => {
  const response = await getAllUsers({
    searchQuery: searchParams.q || "",
    filter: searchParams.filter || "",
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: 10,
  });
  const users = response?.users;
  // console.log(users);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/community"
          iconPosition="right"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {users && users?.length > 0 ? (
          users.map((user: any) => <UserCard key={user.id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl">
            <p>No users yet..</p>
            <Link href={"/sign-up"} className="mt-1 font-bold text-accent-blue">
              Join to be the first one!
            </Link>
          </div>
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

export default Community;
