"use server";

import { revalidatePath } from "next/cache";
import {
  AnswerVoteParams,
  CreateAnswerParams,
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
    await prisma.question.update({
      where: { id: question },
      data: {
        answerIds: newAnswerIds,
        answers: {
          connect: {
            id: newAnswer.id,
          },
        },
      },
    });
    // Add interaction to the user's interactions array

    revalidatePath(path);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    // @ts-ignore
    const { questionId } = params;
    // const cleanedQuestionId = questionId.replace(/"/g, "");
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return answers;
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
      revalidatePath(path);
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
      revalidatePath(path);
    }
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
      revalidatePath(path);
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
      revalidatePath(path);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}
