"use server";
import prisma from "@/utils/prismdb";
import { ViewQuestionParams } from "./shared.types";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    const { questionId, userId } = params;
    const ques = await prisma.question.findFirst({
      where: {
        id: questionId,
      },
    });
    if (!ques) {
      // return console.log("Question not found");
    }
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
    // console.log("Updated question >>>>", updatedQues);
    // Update view count for question
    // console.log("User already viewed? ", userId);
    if (userId) {
      const existingView = await prisma.interaction.findFirst({
        where: {
          questionId,
          userId,
        },
      });
      // console.log("Existing view >>>>", existingView);
      if (existingView)
        return console.log("User has already viewed this question");
      // console.log("Creating new interaction");
      const newInteraction = await prisma.interaction.create({
        data: {
          questionId,
          userId,
          action: "view",
        },
      });
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          reputation: {
            increment: 2,
          },
        },
      });
      // console.log("Updating question with new interaction");
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
