"use server";
import prisma from "@/utils/prismdb";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
// import { NextResponse } from "next/server";

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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
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
    // console.log(newQuestion);
    revalidatePath(path);
    return newQuestion;
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
