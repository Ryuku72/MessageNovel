import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Message Novel" },
    { name: "description", content: "Collaborate and build your own noval" },
  ];
};

export default function Index() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="p-12 flex justify-center items-center gap-3 flex-col">
      <h1 className="text-gray-600 text-3xl m-0 font-medium font-mono">Message Novel</h1>
      <input className="w-full h-11 font-mono font-normal border border-gray-300 rounded-lg py-2 px-4 text-gray-500" />
      </div>
    </div>
  );
}
