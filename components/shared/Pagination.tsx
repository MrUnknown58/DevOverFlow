"use client";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  pageNumber: number;
  isNext: boolean;
  scroll?: boolean;
}
const Pagination = ({ pageNumber, isNext, scroll }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleNavigation = (direction: string) => {
    const nextPage = direction === "next" ? pageNumber + 1 : pageNumber - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPage.toString(),
    });
    router.push(newUrl, { scroll: scroll ? !scroll : true });
  };

  if (!isNext && pageNumber === 1) return null;
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
