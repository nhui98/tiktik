import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GoVerified } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineCancel } from "react-icons/md";
import { BsFillPlayFill } from "react-icons/bs";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";

import Comments from "../../components/Comments/Comments";
import { BASE_URL } from "../../utils";
import LikeButton from "../../components/LikeButton/LikeButton";
import useAuthStore from "../../store/authStore";
import { Video } from "../../types";
import axios from "axios";

interface IProps {
  postDetails: Video;
}

const Detail = ({ postDetails }: IProps) => {
  const [post, setPost] = useState(postDetails);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const { userProfile }: any = useAuthStore();

  const onVideoClick = () => {
    if (isPlaying) {
      videoRef?.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef?.current?.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (post && videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [post, isVideoMuted]);

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const res = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });
      setPost({ ...post, likes: res.data.likes });
    }
  };

  const addComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (userProfile) {
      if (comment) {
        setIsPostingComment(true);
        const res = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
          userId: userProfile._id,
          comment,
        });

        setPost({ ...post, comments: res.data.comments });
        setComment("");
        setIsPostingComment(false);
      }
    }
  };

  return (
    <>
      {post && (
        <div className="absolute left-0 top-0 flex w-full flex-wrap bg-white lg:flex-nowrap">
          <div className="flex-2 relative flex w-[1000px] items-center justify-center bg-blurred-img bg-cover bg-center bg-no-repeat lg:w-9/12">
            <div className="absolute top-6 left-2 z-50 flex gap-6 opacity-90 lg:left-6">
              <p className="cursor-pointer " onClick={() => router.back()}>
                <MdOutlineCancel className="text-[35px] text-white hover:opacity-90" />
              </p>
            </div>
            <div className="relative">
              <div className="h-[60vh] lg:h-[100vh]">
                <video
                  ref={videoRef}
                  onClick={onVideoClick}
                  loop
                  src={post?.video?.asset.url}
                  className=" h-full cursor-pointer"
                ></video>
              </div>

              <div className="absolute top-[45%] left-[40%]  cursor-pointer">
                {!isPlaying && (
                  <button onClick={onVideoClick}>
                    <BsFillPlayFill className="text-6xl text-white lg:text-8xl" />
                  </button>
                )}
              </div>
            </div>
            <div className="absolute bottom-5 right-5 cursor-pointer lg:bottom-10  lg:right-10">
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-3xl text-white lg:text-4xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-3xl text-white lg:text-4xl" />
                </button>
              )}
            </div>
          </div>
          <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
            <div className="mt-10 lg:mt-20">
              <Link href={`/profile/${post.postedBy._id}`}>
                <div className="mb-4 flex w-full cursor-pointer gap-4 bg-white pl-10">
                  <Image
                    width={60}
                    height={60}
                    alt="user-profile"
                    className="rounded-full"
                    src={post.postedBy.image}
                  />
                  <div>
                    <div className="flex items-center justify-center gap-2 text-xl font-bold lowercase tracking-wider">
                      {post.postedBy.userName.replace(/\s+/g, "")}{" "}
                      <GoVerified className="text-xl text-blue-400" />
                    </div>
                    <p className="text-md"> {post.postedBy.userName}</p>
                  </div>
                </div>
              </Link>
              <div className="px-10">
                <p className=" text-md text-gray-600">{post.caption}</p>
              </div>
              <div className="mt-10 px-10">
                {userProfile && (
                  <LikeButton
                    likes={post.likes}
                    flex="flex"
                    handleLike={() => handleLike(true)}
                    handleDislike={() => handleLike(false)}
                  />
                )}
              </div>
              <Comments
                comment={comment}
                setComment={setComment}
                addComment={addComment}
                comments={post.comments}
                isPostingComment={isPostingComment}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const res = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: { postDetails: res.data },
  };
};

export default Detail;
