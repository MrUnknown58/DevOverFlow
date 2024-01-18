"use server";
import prisma from "@/utils/prismdb";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";

export async function getTopInterativeTags(params: GetTopInteractedTagsParams) {
  try {
    const { userId } = params;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    console.log(user);
    return [
      {
        id: "1",
        name: "tag1",
      },
      {
        id: "2",
        name: "tag1",
      },
      {
        id: "3",
        name: "tag3",
      },
    ];
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    const tags = await prisma.tag.findMany({
      // include: {
      //   questions: true,
      //   followers: true,
      // },
    });
    return tags;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getQuestionsByTagID(params: GetQuestionsByTagIdParams) {
  try {
    const { tagId, page = 1, pageSize = 10, searchQuery = "" } = params;
    // const questions = await prisma.question.findMany({
    //   where: {
    //     tags: {
    //       some: {
    //         id: tagId,
    //       },
    //     },
    //     title: {
    //       contains: searchQuery,
    //     },
    //   },
    //   include: {
    //     tags: true,
    //   },
    //   skip: (page - 1) * pageSize,
    //   take: pageSize,
    //   orderBy: {
    //     createdAt: "desc",
    //   },
    // });
    // console.log(questions);
    // return questions;
    const tags = await prisma.tag.findFirst({
      where: {
        id: tagId,
      },
      include: {
        questions: {
          where: {
            title: {
              contains: searchQuery,
            },
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
            answers: true,
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!tags) throw new Error("Tag not found");
    // console.log(tags);
    const questions = tags.questions;
    return { tagTitle: tags.name, questions };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
