"use server";

import { revalidatePath } from "next/cache";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import prisma from "@/utils/prismdb";
import console from "console";
export async function createAnswer(params: CreateAnswerParams) {
  try {
    const { content, author, question, path } = params;
    const newAnswer = await prisma.answer.create({
      data: {
        authorId: author,
        content,
        questionId: question,
      },
    });
    const questionInfo = await prisma.question.findUnique({
      where: {
        id: question,
      },
    });
    const newAnswerIds = [] as string[];
    if (questionInfo)
      newAnswerIds.push(...questionInfo.answerIds, newAnswer.id);
    // Add the answer to the question's answers array
    // console.log(newAnswerIds);
    const ques = await prisma.question.update({
      where: { id: question },
      data: {
        answerIds: newAnswerIds,
        answers: {
          connect: {
            id: newAnswer.id,
          },
        },
      },
      include: {
        tags: true,
      },
    });
    // Add interaction to the user's interactions array
    await prisma.interaction.create({
      data: {
        question: {
          connect: {
            id: ques.id,
          },
        },
        user: {
          connect: {
            id: author,
          },
        },
        answer: {
          connect: {
            id: newAnswer.id,
          },
        },
        action: "answer",
        tags: {
          connect: ques.tags.map((tag) => ({
            id: tag.id,
          })),
        },
      },
    });

    await prisma.user.update({
      where: {
        id: author,
      },
      data: {
        reputation: {
          increment: 10,
        },
      },
    });

    revalidatePath(path);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    const { questionId, sortBy, page = 1, pageSize = 1 } = params;
    const skipAmt = (page - 1) * pageSize;
    let orderBy = {};
    if (sortBy) {
      switch (sortBy) {
        case "highestUpvotes":
          orderBy = {
            upvotes: {
              _count: "desc",
            },
          } as const;
          break;
        case "lowestUpvotes":
          orderBy = {
            upvotes: {
              _count: "asc",
            },
          } as const;
          break;
        case "recent":
          orderBy = {
            createdAt: "desc",
          } as const;
          break;
        case "old":
          orderBy = {
            createdAt: "asc",
          } as const;
          break;
        default:
          orderBy = {
            createdAt: "desc",
          } as const;
          break;
      }
    }
    const answers = await prisma.answer.findMany({
      where: {
        questionId,
      },
      include: {
        author: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            picture: true,
          },
        },
        downvotes: true,
        upvotes: true,
      },
      skip: skipAmt,
      take: pageSize,
      orderBy,
    });
    const totalAnswers = await prisma.answer.count({
      where: {
        questionId,
      },
    });
    const isNext = totalAnswers > skipAmt + pageSize;
    return { answers, isNext };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    const Oldanswer = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
      include: {
        upvotes: true,
        downvotes: true,
      },
    });
    if (!Oldanswer) throw new Error("Answer not found");
    const upvotes = await prisma.upvote.findFirst({
      where: {
        userId,
        answerId,
      },
    });
    const downvote = await prisma.downvote.findFirst({
      where: {
        userId,
        answerId,
      },
    });
    let newUpvote;
    if (upvotes) {
      await prisma.answer.update({
        where: {
          id: answerId,
        },
        data: {
          upvoteId: Oldanswer.upvoteId.filter(
            (upvotesId) => upvotesId !== upvotes.id
          ),
          upvotes: {
            disconnect: {
              id: upvotes.id,
            },
          },
        },
      });
      newUpvote = await prisma.upvote.delete({
        where: {
          id: upvotes.id,
        },
      });
    } else {
      if (downvote) {
        await prisma.answer.update({
          where: {
            id: answerId,
          },
          data: {
            downvoteId: Oldanswer.downvoteId.filter(
              (downvoteId) => downvoteId !== downvote?.id
            ),
            downvotes: {
              disconnect: {
                id: downvote.id,
              },
            },
          },
        });
        await prisma.downvote.delete({
          where: {
            id: downvote.id,
          },
        });
      }
      newUpvote = await prisma.upvote.create({
        data: {
          Answer: {
            connect: {
              id: answerId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      await prisma.answer.update({
        where: {
          id: answerId,
        },
        data: {
          upvoteId: [...Oldanswer.upvoteId, newUpvote.id],
          upvotes: {
            connect: {
              id: newUpvote.id,
            },
          },
        },
      });
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        reputation: {
          increment: upvotes ? -2 : 2,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: Oldanswer.authorId,
      },
      data: {
        reputation: {
          increment: upvotes ? -10 : 10,
        },
      },
    });
    revalidatePath(path);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    const Oldanswer = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
      include: {
        upvotes: true,
        downvotes: true,
      },
    });
    if (!Oldanswer) throw new Error("Answer not found");
    const downvotes = await prisma.downvote.findFirst({
      where: {
        userId,
        answerId,
      },
    });
    const upvote = await prisma.upvote.findFirst({
      where: {
        userId,
        answerId,
      },
    });
    let newDownvote;
    if (downvotes) {
      await prisma.answer.update({
        where: {
          id: answerId,
        },
        data: {
          downvoteId: Oldanswer.downvoteId.filter(
            (downvotesId) => downvotesId !== downvotes.id
          ),
          downvotes: {
            disconnect: {
              id: downvotes.id,
            },
          },
        },
      });
      newDownvote = await prisma.downvote.delete({
        where: {
          id: downvotes.id,
        },
      });
    } else {
      if (upvote) {
        await prisma.answer.update({
          where: {
            id: answerId,
          },
          data: {
            upvoteId: Oldanswer.upvoteId.filter(
              (upvoteId) => upvoteId !== upvote?.id
            ),
            upvotes: {
              disconnect: {
                id: upvote.id,
              },
            },
          },
        });
        await prisma.upvote.delete({
          where: {
            id: upvote.id,
          },
        });
      }
      newDownvote = await prisma.downvote.create({
        data: {
          Answer: {
            connect: {
              id: answerId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      await prisma.answer.update({
        where: {
          id: answerId,
        },
        data: {
          downvoteId: [...Oldanswer.downvoteId, newDownvote.id],
          downvotes: {
            connect: {
              id: newDownvote.id,
            },
          },
        },
      });
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        reputation: {
          increment: downvotes ? 2 : -2,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: Oldanswer.authorId,
      },
      data: {
        reputation: {
          increment: downvotes ? 10 : -10,
        },
      },
    });
    revalidatePath(path);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    const { answerId, path } = params;
    const answer = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
      include: {
        question: true,
      },
    });
    if (!answer) throw new Error("Answer not found");
    await prisma.upvote.deleteMany({
      where: {
        answerId,
      },
    });
    await prisma.downvote.deleteMany({
      where: {
        answerId,
      },
    });
    // console.log("Going to update question >>>>>>>>> ");
    await prisma.question.update({
      where: {
        id: answer.questionId,
      },
      data: {
        // answerIds: answer.question.answerIds.filter((id) => id !== answerId),
        // answers: {
        //   disconnect: {
        //     id: answerId,
        //   },
        // },
        answerIds: {
          set: answer.question.answerIds.filter((id) => id !== answerId),
        },
      },
    });

    // console.log("Updated Question >>>>>>>>>", updatedQues);
    await prisma.answer.delete({
      where: {
        id: answerId,
      },
    });
    // console.log("Deleted Answer >>>>>>>>>", deletedAnswer);
    revalidatePath(path);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
