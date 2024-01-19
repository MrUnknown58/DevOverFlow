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
    const { email, username, name, picture } = updateData;
    const updatedUser = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        email,
        username,
        name,
        picture,
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
    const userQuestionIds = await prisma.question.findMany({
      where: {
        authorId: clerkId,
      },
      select: {
        id: true,
      },
    });
    console.log(
      "userQuestionIds from user.action >>>>>>>>>>> ",
      userQuestionIds
    );
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
    const users = await prisma.user.findMany({
      // select: {
      //   id: true,
      //   username: true,
      //   name: true,
      //   picture: true,
      //   email: true,
      //   createdAt: true,
      // },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(users);
    return users;
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
    console.log(user);
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
    // eslint-disable-next-line no-unused-vars
    const { clerkId, filter, page = 1, pageSize = 10, searchQuery } = params;
    const user = await prisma.user.findFirst({
      where: {
        clerkId,
      },
    });
    if (!user) throw new Error("User not found");
    const savedQuestions = await prisma.question.findMany({
      where: {
        id: {
          in: user.savedQuestionId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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
    });
    return savedQuestions;
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
    return { user, totalQuestions, totalAnswers };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { userId, page = 1, pageSize = 10 } = params;
    const questions = await prisma.question.findMany({
      where: {
        authorId: userId,
      },
      orderBy: [
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
    });
    return {
      totalQuestions: questions.length,
      questions,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { userId, page = 1, pageSize = 10 } = params;
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
    });
    return {
      totalQuestions: answers.length,
      answers,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
