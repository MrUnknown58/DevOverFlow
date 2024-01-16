"use server";

import { revalidatePath } from "next/cache";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
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
    console.log(questionId);
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
