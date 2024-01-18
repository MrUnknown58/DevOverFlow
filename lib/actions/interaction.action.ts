"use server";
import prisma from "@/utils/prismdb";
import { ViewQuestionParams } from "./shared.types";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    const { questionId, userId } = params;

    // Update view count for question
    await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    if (userId) {
      const existingView = await prisma.interaction.findFirst({
        where: {
          questionId,
          userId,
        },
      });
      if (existingView)
        return console.log("User has already viewed this question");
      const newInteraction = await prisma.interaction.create({
        data: {
          questionId,
          userId,
          action: "view",
        },
      });
      await prisma.question.update({
        where: {
          id: questionId,
        },
        data: {
          interactionId: {
            push: newInteraction.id,
          },
        },
      });
    }
  } catch (e) {
    console.log(e);
    throw new Error("Internal Server Error: viewQuestion");
  }
}
