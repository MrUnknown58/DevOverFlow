"use server";
import prisma from "@/utils/prismdb";
import { ViewQuestionParams } from "./shared.types";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    const { questionId, userId } = params;
    const transaction = await prisma.$transaction([
      prisma.question.update({
        where: {
          id: questionId,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      }),
    ]);
    // Update view count for question
    console.log("User already viewed? ", userId);
    if (transaction)
      if (userId) {
        const existingView = await prisma.interaction.findFirst({
          where: {
            questionId,
            userId,
          },
        });
        console.log("Existing view >>>>", existingView);
        if (existingView)
          return console.log("User has already viewed this question");
        console.log("Creating new interaction");
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
            Interaction: {
              connect: {
                id: newInteraction.id,
              },
            },
          },
        });
      }
  } catch (e) {
    console.log(e);
    throw new Error("Internal Server Error: viewQuestion");
  }
}
