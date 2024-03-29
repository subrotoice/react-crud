import React from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const fetchPosts = async ({ asdf = 1 }) => {
  return await fetch(
    `https://api.rawg.io/api/games?page=${asdf}&page_size=10&key=b0d7069520c04a5c8e168712f0464506`
  ).then((res) => res.json());
};

const PostList = () => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ["games"],
    fetchPosts,
    {
      getNextPageParam: (lastPage, allPages) => {
        return allPages.length + 1;
      },
    }
  );

  if (isFetching) return <div>Loading...</div>;
  console.log(data);

  return (
    <div>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.results.map((post, gameIndex) => (
            <div key={post.id}>
              {pageIndex * 10 + gameIndex + 1} {post.name}
            </div>
          ))}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  );
};

export default PostList;
