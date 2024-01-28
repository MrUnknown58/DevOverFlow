import { getTopInterativeTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import RenderTags from "../shared/RenderTags";

interface UserCardProps {
  user: {
    id: string;
    clerkId: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    username: string | null;
    name: string;
    password: string | null;
    bio: string | null;
    picture: string;
    location: string | null;
    portfolioWebsite: string | null;
    reputation: number;
    joinedAt: Date;
    tagId: string | null;
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  const interactedTags = await getTopInterativeTags({ userId: user.id });
  return (
    <>
      <Link
        href={`/profile/${user.clerkId}`}
        className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
      >
        <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
          <Image
            src={user.picture}
            alt="user profile pic"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {user.name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2 line-clamp-1">
              @{user.username || user.email}
            </p>
          </div>
          <div className="mt-5">
            {interactedTags.length > 0 ? (
              <div className="flex items-center gap-2">
                {interactedTags.map((tag) => (
                  <RenderTags key={tag.id} id={tag.id} name={tag.name} />
                ))}
              </div>
            ) : (
              <Badge>No Tags yet</Badge>
            )}
          </div>
        </article>
      </Link>
    </>
  );
};

export default UserCard;
