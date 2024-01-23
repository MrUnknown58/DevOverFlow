"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ProfileSchema } from "@/lib/validations";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
interface ProfileProps {
  clerkId: string;
  user: string;
}
const Profile = ({ clerkId, user }: ProfileProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedUser = JSON.parse(user);
  // const formSchema = z.object({
  //   username: z.string().min(2, {
  //     message: "Username must be at least 2 characters.",
  //   }),
  // });
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsSubmitting(true);
    try {
      // updateUser server action
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      });
      router.back();
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
    // console.log(values);
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-9 flex w-full flex-col gap-9"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>
                  Name <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Name"
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>
                  Username <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Username"
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="portfolioWebsite"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Portfolio Link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Your Portfolio Website"
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Where are you from?"
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's special about you?"
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit !text-light-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
