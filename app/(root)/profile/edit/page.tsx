import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

const EditProfile = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const user = await getUserById({ userId });
  if (!user) return null;
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        {/* <Question
          type="edit"
          userDetails={JSON.stringify(user?.id)}
          questionDetails={JSON.stringify(questionDetails)}
        /> */}
        <Profile clerkId={userId} user={JSON.stringify(user)} />
      </div>
    </>
  );
};

export default EditProfile;
