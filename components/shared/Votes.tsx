"use client";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface VotesProps {
  type: "answer" | "question";
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}: VotesProps) => {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : null,
    });
  }, [itemId, userId, pathname, router]);
  const handleSave = async () => {
    // console.log("save");
    await toggleSaveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path: pathname,
    });
    // toast({
    //   title: `Question ${
    //     !hasSaved ? "Saved in" : "Removed from"
    //   } your collection`,
    //   variant: !hasSaved ? "default" : "destructive",
    // });
    toast.success(
      `Question ${!hasSaved ? "Saved in" : "Removed from"} your collection`
    );
  };
  const handleVote = (vote: "upvote" | "downvote") => async () => {
    if (!userId)
      return toast.error("You need to be logged in to vote on a question.");
    if (vote === "upvote") {
      if (type === "question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path: pathname,
        });
      } else if (type === "answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path: pathname,
        });
      }
      return toast.success(`Upvote ${!hasUpvoted ? "Successful" : "Removed"}`);
    } else if (vote === "downvote") {
      if (type === "question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path: pathname,
        });
      } else if (type === "answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path: pathname,
        });
      }
      return toast.success(
        `Downvote ${!hasDownvoted ? "Successful" : "Removed"}`
      );
    }
    // show a toast
  };
  return (
    <>
      <div className="flex gap-5">
        <div className="flex-center gap-2.5">
          <div className="flex-center gap-1.5">
            <Image
              src={
                hasUpvoted
                  ? "/assets/icons/upvoted.svg"
                  : "/assets/icons/upvote.svg"
              }
              width={18}
              height={18}
              alt="upvote"
              className="cursor-pointer"
              onClick={handleVote("upvote")}
            />
            <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
              <p className="subtle-medium text-dark400_light900">
                {formatNumber(upvotes)}
              </p>
            </div>
          </div>
          <div className="flex-center gap-1.5">
            <Image
              src={
                hasDownvoted
                  ? "/assets/icons/downvoted.svg"
                  : "/assets/icons/downvote.svg"
              }
              width={18}
              height={18}
              alt="downvote"
              className="cursor-pointer"
              onClick={handleVote("downvote")}
            />
            <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
              <p className="subtle-medium text-dark400_light900">
                {formatNumber(downvotes)}
              </p>
            </div>
          </div>
        </div>
        {type === "question" && (
          <Image
            src={
              hasSaved
                ? "/assets/icons/star-filled.svg"
                : "/assets/icons/star-red.svg"
            }
            width={18}
            height={18}
            alt="star"
            className="cursor-pointer"
            onClick={handleSave}
          />
        )}
      </div>
    </>
  );
};

export default Votes;
