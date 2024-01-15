"use server";
import prisma from "@/utils/prismdb";
import { GetTopInteractedTagsParams } from "./shared.types";

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
