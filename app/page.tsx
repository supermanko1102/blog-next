import { getSortedPostsData, getAllCategories } from "@/lib/posts";
import HomePage from "@/app/HomePage";
import { Suspense } from "react";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return [
    { searchParams: {} },
    ...categories.map((category) => ({
      searchParams: { category },
    })),
  ];
}

export default async function Page() {
  const allPosts = await getSortedPostsData();
  const allCategories = getAllCategories();

  return (
    <Suspense fallback={<div>載入中...</div>}>
      <HomePage
        initialPosts={allPosts}
        initialCategories={allCategories}
        initialCategory={null}
      />
    </Suspense>
  );
}
