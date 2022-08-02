import Link from "next/link";
import { useRouter } from "next/router";
import { topics } from "../../utils/constants";

export default function Discover() {
  const router = useRouter();
  const { topic } = router.query;

  return (
    <div className="pb-6 xl:border-b-2 xl:border-gray-200">
      <p className="m-3 mt-4 hidden font-semibold text-gray-500 xl:block">
        Popular Topics
      </p>
      <div className="flex flex-wrap gap-3">
        {topics.map((item) => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div
              className={`flex cursor-pointer items-center justify-center gap-2 rounded px-3 py-2  hover:bg-primary xl:rounded-full xl:border-2 ${
                topic === item.name
                  ? "text-[#FF1997]  xl:border-[#F51997]"
                  : "text-black xl:border-gray-300"
              }`}
            >
              <span className="xl:text-md text-2xl font-bold">{item.icon}</span>
              <span className="text-md hidden font-medium capitalize xl:block">
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
