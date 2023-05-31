import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { allPostData } from "~/data/dummy";
import Post from "../Universal/Post";
import { api } from "~/utils/api";


const AllPosts = ({ selected, query }: { selected: boolean, query: string }) => {
  // api call to get data based on selected get "reccomended | hot" type posts
  const { data: allPosts } = query ? api.post.search.useQuery({ query: query }) : api.post.getLatestPosts.useQuery();
  // const { data: allPosts } = api.post.getLatestPosts.useQuery();
  if (!allPosts) return <LoadingSpinner />

  return (
    <div className="mt-8 space-y-8">
      {allPosts.posts.map((post, index) => {
        return <Post post={post} key={index} />
      })}
    </div>
  )
}

export default AllPosts