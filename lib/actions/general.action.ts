"use server";

import { SearchParams } from "./shared.types";
import prisma from "@/utils/prismdb";

const SearchableTypes = ["question", "answer", "user", "tag"];
export async function globalSearch(params: SearchParams) {
  try {
    const { query, type } = params;
    const typeLowerCase = type?.toLowerCase();
    let results = [];
    const modelAndTypes = [
      { model: prisma.question, searchField: "title", type: "question" },
      { model: prisma.answer, searchField: "content", type: "answer" },
      { model: prisma.user, searchField: "name", type: "user" },
      { model: prisma.tag, searchField: "name", type: "tag" },
    ];
    if (!typeLowerCase || !SearchableTypes.includes(typeLowerCase)) {
      for (const { model, searchField, type } of modelAndTypes) {
        // @ts-ignore
        const searchResults = await model.findMany({
          where: {
            [searchField]: {
              contains: query,
              mode: "insensitive",
            },
          },
          take: 2,
        });
        console.log("Logging searchresults >>>>>>>>>>>>>", searchResults);
        results.push(
          ...searchResults.map((item: any) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? item.questionId
                : item.id,
          }))
        );
      }
    } else {
      const modelInfo = modelAndTypes.find((m) => m.type === typeLowerCase);
      if (!modelInfo) {
        throw new Error("Invalid type");
      }
      // @ts-ignore
      const searchResults = await modelInfo.model.findMany({
        where: {
          [modelInfo.searchField]: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 8,
      });
      results = searchResults.map((item: any) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.questionId
            : item._id,
      }));
    }
    console.log("Logging from generalAction >>>>>>>>>>>>>", results);
    return JSON.stringify(results);
  } catch (error) {
    console.log("Error fetching global results", error);
    throw new Error("Error fetching global results");
  }
}
