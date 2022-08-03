import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoVerified } from "react-icons/go";

import useAuthStore from "../../store/authStore";
import NoResults from "../NoResults/NoResults";
import { IUser } from "../../types";

interface IProps {
  isPostingComment: Boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: React.FormEvent) => void;
  comments: IComment[];
}

interface IComment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref?: string; _id?: string };
}

const Comments = ({
  comment,
  setComment,
  addComment,
  comments,
  isPostingComment,
}: IProps) => {
  const { allUsers, userProfile }: any = useAuthStore();

  return (
    <div className="mt-4 border-t-2 border-b-2 border-gray-200 bg-[#F8F8F8] px-10 pt-4 pb-[100px] lg:pb-0">
      <div className="overflow-scroll lg:h-[457px]">
        {comments?.length > 0 ? (
          comments?.map((item: IComment, idx: number) => (
            <React.Fragment key={idx}>
              {allUsers?.map(
                (user: IUser) =>
                  user._id === (item.postedBy._ref || item.postedBy._id) && (
                    <div className=" items-center p-2" key={idx}>
                      <Link href={`/profile/${user._id}`}>
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12">
                            <Image
                              width={48}
                              height={48}
                              className="cursor-pointer rounded-full"
                              src={user.image}
                              alt="user-profile"
                              layout="responsive"
                            />
                          </div>

                          <p className="flex cursor-pointer items-center gap-1 text-[18px] font-bold leading-6 text-primary">
                            {user.userName}{" "}
                            <GoVerified className="text-blue-400" />
                          </p>
                        </div>
                      </Link>
                      <div>
                        <p className="-mt-5 ml-16 mr-8 text-[16px]">
                          {item.comment}
                        </p>
                      </div>
                    </div>
                  )
              )}
            </React.Fragment>
          ))
        ) : (
          <NoResults text="No Comments Yet! Be First to do add the comment." />
        )}
      </div>
      {userProfile && (
        <div className="absolute bottom-0 left-0  px-2 pb-6 md:px-10 ">
          <form onSubmit={addComment} className="flex gap-4">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-md w-[250px] flex-1 rounded-lg border-2 border-gray-100 bg-primary px-6 py-4 font-medium focus:border-2 focus:border-gray-300 focus:outline-none md:w-[700px] lg:w-[350px]"
              placeholder="Add comment.."
            />
            <button className="text-md text-gray-400 " onClick={addComment}>
              {isPostingComment ? "Commenting..." : "Comment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Comments;
