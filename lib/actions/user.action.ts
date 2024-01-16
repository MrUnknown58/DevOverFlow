"use server";
import prisma from "@/utils/prismdb";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";

export async function getUserById({ userId }: GetUserByIdParams) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        savedQuestions: true,
      },
    });
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
    console.log(userQuestionIds);
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
