import axios from "axios";
import type { NextPage } from "next";
import NoResults from "../components/NoResults/NoResults";
import VideoCard from "../components/VideoCard/VideoCard";
import { Video } from "../types";

interface IProps {
  videos: Video[];
}

const Home: NextPage<IProps> = ({ videos }) => {
  return (
    <div className="videos flex h-full flex-col gap-10">
      {videos.length ? (
        videos.map((video) => <VideoCard post={video} key={video._id} />)
      ) : (
        <NoResults text={"No Videos"} />
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  const { data } = await axios.get(`http://localhost:3000/api/post`);

  return {
    props: {
      videos: data,
    },
  };
};

export default Home;
