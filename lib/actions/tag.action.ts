"use server";
import prisma from "@/utils/prismdb";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import console from "console";

export async function getTopInterativeTags(params: GetTopInteractedTagsParams) {
  try {
    const { userId } = params;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    const userInteractions = await prisma.interaction.findMany({
      where: {
        userId: user.id,
      },
      include: {
        tags: true,
      },
    });

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        // @ts-ignore
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    const tagCountMap = userTags.reduce((countMap: any, tag: any) => {
      countMap.set(tag, (countMap.get(tag) || 0) + 1);
      return countMap;
    }, new Map());

    const sortedTags = Array.from(tagCountMap.entries()).sort(
      (a: any, b: any) => b[1] - a[1]
    );

    const top3Tags = sortedTags.slice(0, 3).map((tag: any) => tag[0]);

    return top3Tags || [];
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    let orderBy = {};
    if (filter) {
      switch (filter) {
        case "popular":
          orderBy = {
            questions: {
              _count: "desc",
            },
          } as const;
          break;
        case "recent":
          orderBy = {
            createdAt: "desc",
          } as const;
          break;
        case "name":
          orderBy = {
            name: "asc",
          } as const;
          break;
        case "old":
          orderBy = {
            createdAt: "asc",
          } as const;
          break;
        default:
          orderBy = {
            questions: {
              _count: "desc",
            },
          } as const;
      }
    }
    const skipAmt = (page - 1) * pageSize;
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      skip: skipAmt,
      take: pageSize,

      orderBy,
    });
    const tagsCount = await prisma.tag.count({
      where: {
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    });
    const isNext = tagsCount > skipAmt + pageSize;
    return { tags, isNext };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getQuestionsByTagID(params: GetQuestionsByTagIdParams) {
  try {
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const skipAmit = (page - 1) * pageSize;
    const tags = await prisma.tag.findFirst({
      where: {
        id: tagId,
      },
      include: {
        questions: {
          where: {
            title: {
              contains: searchQuery,
              mode: "insensitive",
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
          skip: skipAmit,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    const questionsCount = await prisma.question.count({
      where: {
        tags: {
          some: {
            id: tagId,
          },
        },
        title: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    });
    if (!tags) throw new Error("Tag not found");
    const questions = tags.questions;
    const isNext = questionsCount > skipAmit + pageSize;
    return { tagTitle: tags.name, questions, isNext };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getTopPopularTags() {
  try {
    const popularTags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        questions: {
          select: {
            _count: true,
          },
        },
        _count: true,
      },
      orderBy: {
        questions: { _count: "desc" },
      },
      take: 5,
    });
    // console.log(popularTags);
    return popularTags;
  } catch (e) {
    console.log(e);
    throw new Error("Something went wrong: getTopPopularTags");
  }
}
