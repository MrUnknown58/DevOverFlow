"use server";
import prisma from "@/utils/prismdb";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    // const { page, pageSize, searchQuery, filter } = params;
    // const questions = await prisma.question.findMany({
    //   where: {
    //     title: {
    //       contains: searchQuery,
    //     },
    //   },
    //   include: {
    //     tags: true,
    //   },
    //   skip: (page - 1) * pageSize,
    //   take: pageSize,
    // });
    const questions = await prisma.question.findMany({
      include: {
        tags: true,
        author: true,
        answers: true,
        upvotes: true,
        downvotes: true,
        Interaction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(questions);
    return questions;
  } catch (e) {
    console.log(e);
    throw new Error("Internal Server Error: getQuestions");
    // return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function createQuestion(question: CreateQuestionParams) {
  try {
    // const questionId = await db.question.create(question);
    // return questionId;
    const { title, content, tags, author, path } = question;

    const questionId = await prisma.question.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: author,
          },
        },
      },
    });
    const tagIds = [];
    for (const tag of tags) {
      const existingtag = await prisma.tag.upsert({
        where: {
          name: tag,
        },
        update: {
          questions: {
            connect: {
              id: questionId.id,
            },
          },
        },
        create: {
          name: tag,
          questions: {
            connect: {
              id: questionId.id,
            },
          },
        },
      });
      tagIds.push(existingtag.id);
    }
    // const newInteraction = await prisma.interaction.create({});
    // console.log(tagIds);
    const newQuestion = await prisma.question.update({
      where: {
        id: questionId.id,
      },
      data: {
        tags: {
          connect: tagIds.map((tagId) => ({ id: tagId })),
        },
      },
    });
    console.log(newQuestion);
    revalidatePath(path);
    // return newQuestion;
  } catch (e) {
    console.log(e);
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    const { questionId } = params;
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        upvotes: true,
        downvotes: true,
        author: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            picture: true,
          },
        },
        // answers: true,
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return question;
  } catch (e) {
    console.log(e);
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    const Oldquestion = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        upvotes: true,
        downvotes: true,
      },
    });
    if (!Oldquestion) throw new Error("Question not found: upvoteQuestion");
    const upvotes = await prisma.upvote.findFirst({
      where: {
        userId,
        questionId,
      },
    });
    const downvote = await prisma.downvote.findFirst({
      where: {
        userId,
        questionId,
      },
    });
    let newUpvote;
    if (upvotes) {
      await prisma.question.update({
        where: {
          id: questionId,
        },
        data: {
          upvoteId: Oldquestion.upvoteId.filter(
            (upvotesId) => upvotesId !== upvotes.id
          ),
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
        await prisma.question.update({
          where: {
            id: questionId,
          },
          data: {
            downvoteId: Oldquestion.downvoteId.filter(
              (downvoteId) => downvoteId !== downvote?.id
            ),
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
          Question: {
            connect: {
              id: questionId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      await prisma.question.update({
        where: {
          id: questionId,
        },
        data: {
          upvoteId: [...Oldquestion.upvoteId, newUpvote.id],
          upvotes: {
            connect: {
              id: newUpvote.id,
            },
          },
        },
        include: {
          upvotes: true,
          downvotes: true,
        },
      });
      revalidatePath(path);
    }

    // Increment author's reputation

    revalidatePath(path);
  } catch (e) {
    console.log(e);
    throw new Error("Internal Server Error: upvoteQuestion");
  }
}
export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    const Oldquestion = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        upvotes: true,
        downvotes: true,
      },
    });
    if (!Oldquestion) throw new Error("Question not found: downvoteQuestion");
    const upvotes = await prisma.upvote.findFirst({
      where: {
        userId,
        questionId,
      },
    });
    const downvote = await prisma.downvote.findFirst({
      where: {
        userId,
        questionId,
      },
    });
    let newDownvote;
    if (downvote) {
      await prisma.question.update({
        where: {
          id: questionId,
        },
        data: {
          downvoteId: Oldquestion.downvoteId.filter(
            (downvoteId) => downvoteId !== downvote?.id
          ),
        },
      });
      newDownvote = await prisma.downvote.delete({
        where: {
          id: downvote?.id,
        },
      });
      revalidatePath(path);
      // newDownvote = await prisma.downvote.upsert({
      //   where: {
      //     id: downvote?.id,
      //     userId,
      //     questionId,
      //   },
      //   update: {
      //     Question: {
      //       connect: {
      //         id: questionId,
      //       },
      //     },
      //   },
      //   create: {
      //     Question: {
      //       connect: {
      //         id: questionId,
      //       },
      //     },
      //     user: {
      //       connect: {
      //         id: userId,
      //       },
      //     },
      //   },
      // });
    } else {
      if (upvotes) {
        await prisma.question.update({
          where: {
            id: questionId,
          },
          data: {
            upvoteId: Oldquestion.upvoteId.filter(
              (upvotesId) => upvotesId !== upvotes.id
            ),
          },
        });
        await prisma.upvote.delete({
          where: {
            id: upvotes.id,
          },
        });
      }
      newDownvote = await prisma.downvote.create({
        data: {
          Question: {
            connect: {
              id: questionId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      // console.log(newDownvote);
      await prisma.question.update({
        where: {
          id: questionId,
        },
        data: {
          downvoteId: [...Oldquestion.downvoteId, newDownvote.id],
          downvotes: {
            connect: {
              id: newDownvote.id,
            },
          },
        },
        include: {
          upvotes: true,
          downvotes: true,
        },
      });
      revalidatePath(path);
    }
  } catch (e) {
    console.log(e);
    throw new Error("Internal Server Error: downvoteQuestion");
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    const { questionId, path } = params;
    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
      },
      include: {
        answers: true,
      },
    });
    const answerIds = question?.answers.map((answer) => answer.id);
    await prisma.interaction.deleteMany({
      where: {
        questionId,
      },
    });
    await prisma.upvote.deleteMany({
      where: {
        OR: [
          {
            questionId,
          },
          {
            answerId: {
              in: answerIds,
            },
          },
        ],
      },
    });
    await prisma.downvote.deleteMany({
      where: {
        OR: [
          {
            questionId,
          },
          {
            answerId: {
              in: answerIds,
            },
          },
        ],
      },
    });
    await prisma.answer.deleteMany({
      where: {
        questionId,
      },
    });
    const tags = await prisma.tag.findMany({
      where: {
        questions: {
          some: {
            id: questionId,
          },
        },
      },
    });

    // For each tag, remove the questionId from the questionId array
    for (const tag of tags) {
      const updatedQuestionIds = tag.questionId.filter(
        (id) => id !== questionId
      );

      await prisma.tag.update({
        where: { id: tag.id },
        data: {
          questionId: {
            set: updatedQuestionIds,
          },
        },
      });
    }
    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });
    revalidatePath(path);
    return question;
  } catch (e) {
    console.log(e);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    const { questionId, title, content, path } = params;
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        tags: true,
      },
    });
    if (!question) throw new Error("Question not found");
    // const tagIds = [];
    // for (const tag of tags) {
    //   const existingtag = await prisma.tag.upsert({
    //     where: {
    //       name: tag,
    //     },
    //     update: {
    //       questions: {
    //         connect: {
    //           id: questionId,
    //         },
    //       },
    //     },
    //     create: {
    //       name: tag,
    //       questions: {
    //         connect: {
    //           id: questionId,
    //         },
    //       },
    //     },
    //   });
    //   tagIds.push(existingtag.id);
    // }
    const updatedQuestion = await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        title,
        content,
      },
    });
    revalidatePath(path);
    return updatedQuestion;
  } catch (e) {
    console.log(e);
  }
}
