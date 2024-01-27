"use server";
import prisma from "@/utils/prismdb";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getUserById({ userId }: GetUserByIdParams) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  } catch (e) {
    console.log(e);
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    const newUser = await prisma.user.create({
      data: userData,
    });
    return newUser;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function updateUser({
  clerkId,
  updateData,
  path,
}: UpdateUserParams) {
  try {
    // const { email, username, name, picture } = updateData;
    const updatedUser = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        ...updateData,
      },
    });
    revalidatePath(path);
    return updatedUser;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteUser({ clerkId }: DeleteUserParams) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        clerkId,
      },
    });
    if (!existingUser) throw new Error("User not found");

    // TODO: Delete all user's posts
    // get all posts by user
    await prisma.question.findMany({
      where: {
        authorId: clerkId,
      },
      select: {
        id: true,
      },
    });
    // console.log(
    //   "userQuestionIds from user.action >>>>>>>>>>> ",
    //   userQuestionIds
    // );
    await prisma.question.deleteMany({
      where: {
        authorId: clerkId,
      },
    });

    // delete all answers to those questions

    const deletedUser = await prisma.user.delete({
      where: {
        id: clerkId,
      },
    });
    return deletedUser;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    let orderBy;
    if (filter) {
      switch (filter) {
        case "new_users":
          orderBy = {
            createdAt: "desc",
          } as const;
          break;
        case "old_users":
          orderBy = {
            createdAt: "asc",
          } as const;
          break;
        case "top_contributors":
          orderBy = { reputation: "desc" } as const;
          break;
        default:
          orderBy = {
            createdAt: "desc",
          } as const;
      }
    }
    const skipAmt = (page - 1) * pageSize;
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      skip: skipAmt,
      take: pageSize,
      orderBy,
    });
    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          {
            username: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    const isNext = totalUsers > skipAmt + users.length;
    // console.log(users);
    return { users, isNext };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    const { userId, questionId, path } = params;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    // console.log(user);
    const isSaved = user.savedQuestionId.includes(questionId);
    if (isSaved) {
      // remove question from saved questions
      const newSavedQuestions = user.savedQuestionId.filter(
        (id) => id !== questionId
      );
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          savedQuestionId: newSavedQuestions,
        },
      });
      console.log(updatedUser);
      // return updatedUser;
    } else {
      // add question to saved questions
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          savedQuestionId: [...user.savedQuestionId, questionId],
        },
      });
      console.log(updatedUser);
      // return updatedUser;
    }
    revalidatePath(path);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    const { clerkId, filter, page = 1, pageSize = 20, searchQuery } = params;
    const skipAmt = (page - 1) * pageSize;
    const user = await prisma.user.findFirst({
      where: {
        clerkId,
      },
    });
    if (!user) throw new Error("User not found");
    let orderBy;
    if (filter) {
      switch (filter) {
        case "most_recent":
          orderBy = {
            createdAt: "desc",
          } as const;
          break;
        case "oldest":
          orderBy = {
            createdAt: "asc",
          } as const;
          break;
        case "most_voted":
          orderBy = {
            upvotes: {
              _count: "desc",
            },
          } as const;
          break;
        case "most_viewed":
          orderBy = {
            views: "desc",
          } as const;
          break;
        case "most_answered":
          orderBy = {
            answers: {
              _count: "desc",
            },
          } as const;
          break;
        default:
          orderBy = {
            createdAt: "desc",
          } as const;
      }
    }
    const savedQuestions = await prisma.question.findMany({
      where: {
        id: {
          in: user.savedQuestionId,
        },
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy,
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            picture: true,
          },
        },
        answers: true,
        upvotes: true,
        downvotes: true,
      },
      skip: skipAmt,
      take: pageSize,
    });
    const totalSavedQuestions = await prisma.question.count({
      where: {
        id: {
          in: user.savedQuestionId,
        },
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    const isNext = totalSavedQuestions > skipAmt + savedQuestions.length;
    return { questions: savedQuestions, isNext };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    const { userId } = params;
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user) throw new Error("User not found");
    const totalQuestions = await prisma.question.count({
      where: {
        authorId: user.id,
      },
    });
    const totalAnswers = await prisma.answer.count({
      where: {
        authorId: user.id,
      },
    });
    const questionUpvotes = await prisma.question.aggregate({
      where: {
        authorId: user.id,
        upvoteId: {
          isEmpty: false,
        },
      },
      _count: {
        upvoteId: true,
      },
    });
    const answerUpvotes = await prisma.answer.aggregate({
      where: {
        authorId: user.id,
        upvoteId: {
          isEmpty: false,
        },
      },
      _count: {
        upvoteId: true,
      },
    });
    const questionViews = await prisma.question.aggregate({
      where: {
        authorId: user.id,
      },
      _sum: {
        views: true,
      },
    });
    console.log(questionUpvotes, "     ", answerUpvotes, "    ", questionViews);
    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?._count.upvoteId || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?._count.upvoteId || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?._sum.views || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });
    return { user, totalQuestions, totalAnswers, badgeCounts };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmt = (page - 1) * pageSize;
    const questions = await prisma.question.findMany({
      where: {
        authorId: userId,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          views: "desc",
        },
        {
          upvotes: {
            _count: "desc",
          },
        },
      ],
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            picture: true,
          },
        },
        answers: true,
        upvotes: true,
        downvotes: true,
      },
      skip: skipAmt,
      take: pageSize,
    });
    const totalQuestions = await prisma.question.count({
      where: {
        authorId: userId,
      },
    });
    const isNext = totalQuestions > skipAmt + questions.length;
    return {
      totalQuestions: questions.length,
      questions,
      isNext,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmt = (page - 1) * pageSize;
    const answers = await prisma.answer.findMany({
      where: {
        authorId: userId,
      },
      orderBy: [
        {
          upvotes: {
            _count: "desc",
          },
        },
      ],
      include: {
        question: {
          select: {
            id: true,
            title: true,
          },
        },
        author: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            picture: true,
          },
        },
        upvotes: true,
        downvotes: true,
      },
      skip: skipAmt,
      take: pageSize,
    });
    const totalAnswers = await prisma.answer.count({
      where: {
        authorId: userId,
      },
    });
    const isNext = totalAnswers > skipAmt + answers.length;
    return {
      totalQuestions: answers.length,
      answers,
      isNext,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
