import type { NextPage } from "next";
import { $fetch } from "ohmyfetch";
import useSWR from "swr";

const getRandom = <T extends Object>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const Page: NextPage = () => {
  const { data, error, mutate } = useSWR("/api/ranking", $fetch);
  const randomPost = async () => {
    await $fetch("/api/ranking", {
      method: "POST",
      body: {
        name: getRandom(["月毎ランキング", "週間ランキング", "日間ランキング"]),
        rank: getRandom([1, 2, 3, 4, 5, 6, 7, 8]),
        todouhukenId: getRandom([40, 41, 42, 43, 44, 45, 46, 47]),
      },
    });
    mutate();
  };
  const deleteAll = async () => {
    await $fetch("/api/ranking", {
      method: "DELETE",
    });
    mutate();
  };
  return (
    <div className="text-gray-800 container p-4 grid grid-cols-1 gap-4">
      <h2 className="text-3xl">Next.js + SQLite + Litestream + Cloud Run</h2>
      <pre className={`${error ? "text-red-800" : null} bg-gray-100 p-4 rounded`}>
        {JSON.stringify(error ?? data, null, 2)}
      </pre>
      <button onClick={randomPost} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        random post
      </button>
      <button onClick={deleteAll} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        delete all
      </button>
    </div>
  );
};
export default Page;
