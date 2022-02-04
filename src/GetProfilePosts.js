import React from "react";
import SinglePost from "./SinglePost";
import Loading from "./Loading";

const GetProfilePosts = ({ posts, loading, email }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems:"center"
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        posts.map((post) => {
          if (post.Post.user.email === email){
            return loading ? (
              <h2>Loading</h2>
            ) : (
              <SinglePost key={post.Post.id} post={post} />
            );
          }
        })
      )}
    </div>
  );
};

export default GetProfilePosts;
