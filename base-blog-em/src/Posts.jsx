import { useState, useEffect } from "react";
import {useQuery, useQueryClient} from '@tanstack/react-query'

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  const {data, isError, isLoading, error} = useQuery({
    queryKey:["posts", currentPage],
    queryFn: () => fetchPosts(currentPage)
  });


  useEffect(() => {
    const nextPage = currentPage + 1

    if(nextPage > 10) return 

    queryClient.prefetchQuery({
      queryKey:["posts", nextPage],
      queryFn: () => fetchPosts(nextPage)
    })
  },[currentPage, queryClient])


  if(isLoading) {
    return (
      <h3>Loading... </h3>
    )
  }

  if(isError) {
    return (
      <h3>{error.toString()}</h3>
    )
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage === 1} onClick={() => {
          if(currentPage === 1) return

          setCurrentPage(state => {
            return state - 1
          })
        }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage === 10} onClick={() => {          
           if(currentPage === 10) return
          setCurrentPage(state => {
            return state + 1
          })
        }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
