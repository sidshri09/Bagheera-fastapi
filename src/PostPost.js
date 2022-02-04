import React, { useState } from "react";

const PostPost = () => {
  const [postContent, setPostContent] = useState("");
  const postUrl = "http://localhost:8000/posts";
  const postProdUrl = "https://fastapi-bagheera.herokuapp.com/posts";

  const handSubmit = async (e) => {
    e.preventDefault();
    console.log("inside handSubmit of POST PostPost", postContent);
    const response = await fetch(postProdUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        content: postContent,
      }),
    });

    //setPostContent('')
    window.location.reload();
  };
  return (
    <section
      className="section-center"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        style={{
          width: "700px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        className="grocery-form"
      >
        <h3 style={{fontFamily:'cursive'}}>Write a Post</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "650px",
            }}
          >
            <div className="form-control" onSubmit={handSubmit}>
              <input
                className="search-input"
                type="text"
                id="content"
                value={postContent}
                placeholder="What's on your mind?"
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <button
                style={{paddingTop:'6px'}}
                className="member-post-btn"
                type="submit"
                onClick={handSubmit}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default PostPost;
