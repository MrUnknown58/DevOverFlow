"use client";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionSchema } from "@/lib/validations";
import * as z from "zod";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
import { toast } from "sonner";

// const type = "create";

interface QuestionProps {
  type?: "create" | "edit";
  userDetails: string;
  questionDetails?: string;
}

const Question = ({
  type = "create",
  questionDetails,
  userDetails,
}: QuestionProps) => {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const parsedQuestionDetails = JSON.parse(questionDetails || "{}");
  const groupedTags = parsedQuestionDetails?.tags?.map((tag: any) => tag.name);
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || "",
      explanation: parsedQuestionDetails?.content || "",
      tags: groupedTags || [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsSubmitting(true);
    try {
      if (type === "edit") {
        // await editQuestion({});
        await editQuestion({
          title: values.title,
          content: values.explanation,
          questionId: parsedQuestionDetails.id,
          path: pathname,
        });
        // toast({
        //   title: "Question Updated Successfully",
        //   variant: "default",
        // });
        toast.success("Question Updated Successfully");
        router.push(`/question/${parsedQuestionDetails.id}`);
      } else if (type === "create") {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(userDetails),
          path: pathname,
        });
        // toast({
        //   title: "Question Posted Successfully",
        //   variant: "default",
        // });
        toast.success("Question Posted Successfully");
        router.push("/");
      }
    } catch (e) {
      console.log(e);
      // toast({
      //   title: "Something went wrong",
      //   variant: "destructive",
      // });
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
    // console.log(values);
  }
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    // console.log(field);
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      if (tagValue !== "") {
        if (tagValue.length > 15)
          return form.setError("tags", {
            type: "required",
            message: "Tag length must be less than 15 characters",
          });
        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...form.getValues("tags"), tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light700">
                  Question Title <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    // placeholder="shadcn"
                    {...field}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Be specific and imagine you&apos;re asking a question to
                  another person
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark400_light700">
                  Detailed Explanation of your Problem{" "}
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    initialValue={
                      type === "edit" ? parsedQuestionDetails.content : ""
                    }
                    onBlur={field.onBlur}
                    onEditorChange={(content, editor) => {
                      field.onChange(content);
                      // console.log(content);
                    }}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist ",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: theme === "dark" ? "oxide-dark" : "oxide",
                      content_css: theme === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light700">
                  Tags <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      placeholder="Add tags..."
                      disabled={type === "edit"}
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                      className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag: string, index: number) => (
                          <Badge
                            key={tag}
                            className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                            onClick={() =>
                              type !== "edit"
                                ? handleTagRemove(tag, field)
                                : () => {}
                            }
                          >
                            {tag}
                            {type !== "edit" && (
                              <Image
                                src={"/assets/icons/close.svg"}
                                alt="close icon"
                                height={12}
                                width={12}
                                className="cursor-pointer object-contain invert-0 dark:invert"
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Add up to 5 tags to describe what your question is about You
                  need to press enter after each tag for it to be added.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900 disabled:bg-slate-400"
            disabled={isSubmitting}
            onClick={() => console.log(form.getValues())}
          >
            {isSubmitting ? (
              <>{type === "create" ? "Posting" : "Updating"} Question...</>
            ) : (
              <>{type === "create" ? "Ask a" : "Edit"} Question</>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Question;
