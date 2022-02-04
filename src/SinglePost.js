import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineLike,
  AiTwotoneLike,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMore,
} from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RiReplyLine } from "react-icons/ri";
import moment from "moment";
import Replies from "./Replies";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

const SinglePost = ({ post }) => {
  const textRef = useRef(null);
  const getProdUrl = "https://fastapi-bagheera.herokuapp.com/posts";
  const voteProdUrl = "https://fastapi-bagheera.herokuapp.com/votes";
  const getUrl = "http://localhost:8000/posts";
  const voteUrl = "http://localhost:8000/votes";

  const s3uri =
    "https://bagheera-img.s3.amazonaws.com/another%40example.com/download.jpeg";

  const [postId, setPostId] = useState(0);
  const [postLike, setPostLike] = useState(0);
  const [postLiked, setPostLiked] = useState(false);
  const [postDeleted, setPostDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [postReply, setPostReply] = useState(false);
  const [replyList, setReplyList] = useState([]);
  const [showReply, setShowReply] = useState(false);
  const [anyReply, setAnyReply] = useState(false);
  const [replyCount, setReplyCount] = useState(0);

  const { Post, votes } = post;
  const { id, content, user_id, CreatedAt, user, parent_post } = Post;

  let dt = moment(CreatedAt).format("MMMM D, YYYY, h:mm:ss a");

  useEffect(() => {
    setPostId(id);
    setPostLike(votes);
    setPostContent(content);
    fetchReplies();
  }, [post]);

  useEffect(() => {
    //re render on update
    setPostLike((prev) => prev);
  }, [postLiked]);

  useEffect(async () => {
    try {
      const res = await fetch(`${voteProdUrl}/${id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (res.status === 200) {
        setPostLiked(true);
      }
      if (res.status === 404) {
        console.log("no votes for post id", id);
      }
    } catch (err) {}
  }, [postLiked]);

  const fetchReplies = async () => {
    const response = await fetch(getProdUrl + "/replies/" + id, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      setReplyList(data);
      setAnyReply(true);
      setReplyCount(data.length);
    } else {
      setReplyList([]);
      console.log("no replies for post id", id);
    }
  };

  const handSubmit = async (e) => {
    e.preventDefault();
    console.log("inside handSubmit of POST PostPost", postContent);
    const response = await fetch(getProdUrl + "/" + id, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        content: postContent,
      }),
    });
    setEditing(false);
    window.location.reload();
  };

  const postReplyFunc = async (e) => {
    e.preventDefault();
    console.log("inside handSubmit of POST PostPost", postContent);
    const response = await fetch(getProdUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        content: replyContent,
        parent_post: id,
      }),
    });
    setPostReply(false);
    window.location.reload();
  };

  const addLike = async () => {
    if (postLiked) return;
    setPostLiked(true);
    setPostLike((prev) => prev + 1);

    const response = await fetch(voteProdUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ post_id: id, vote_dir: true }),
    });
    if (response.status === 201) {
      setPostLiked(true);
    } else {
      setPostLiked(false);
    }

    return response.status;
  };

  const unlikePost = async () => {
    if (!postLiked) return;
    setPostLiked(false);
    setPostLike((prev) => prev - 1);

    const response = await fetch(voteProdUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ post_id: id, vote_dir: false }),
    });
    if (response.status === 201) {
      setPostLiked(false);
    }

    return response.status;
  };

  const handleDelete = async () => {
    const response = await fetch(`${getProdUrl}/${id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 204) {
      setPostDeleted(true);
    }
    if (response.status === 404) {
      setPostDeleted(true);
    }
    window.location.reload();
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleReply = () => {
    console.log("inside handleReply");
    setPostReply(true);
  };

  const openSinglePost = () => {
    window.location.replace(`https://bagheerapost.com/post/${id}`);
    // window.location.replace(`http://localhost:3000/post/${id}`);
  };

  const handlePostClick = (e) => {
    if (
      e.target.classList.contains("item") ||
      e.target.classList.contains("item-center") ||
      e.target.classList.contains("img-container") ||
      e.target.classList.contains("person-img") ||
      e.target.classList.contains("itm")
    ) {
      openSinglePost();
    }
  };

  return (
    <>
      {postDeleted ? null : editing ? (
        <section className="section-center">
          <form className="grocery-form">
            <div className="form-control">
              <input
                type="text"
                id="content"
                ref={textRef}
                autoFocus
                value={postContent}
                placeholder={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "15px",
              }}
            >
              <button className="button" type="submit" onClick={handSubmit}>
                Submit
              </button>
              <button
                className="button"
                type="submit"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : postReply ? (
        <section className="section-center">
          <form className="grocery-form">
            <div className="form-control">
              <input
                type="text"
                id="content"
                autoFocus
                value={replyContent}
                placeholder="Reply..."
                onChange={(e) => setReplyContent(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "15px",
              }}
            >
              <button className="button" type="submit" onClick={postReplyFunc}>
                Submit
              </button>
              <button
                className="button"
                type="submit"
                onClick={() => setPostReply(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "25px",
          }}
        >
          <section
            key={id}
            className="item"
            onClick={(e) => handlePostClick(e)}
          >
            {parent_post === null ? null : (
              <Link to={`/post/${parent_post}`}>
                <AiOutlineMore data-tip data-for="parentTip" />
                <ReactTooltip id="parentTip" place="top" effect="solid">
                  Original Post
                </ReactTooltip>
              </Link>
            )}
            <div className="item-center">
              <div className="img-container" style={{ marginTop: "15px" }}>
                <img
                  style={{ width: "100px", height: "100px" }}
                  className="person-img"
                  src={Post.user.profile_pic}
                ></img>
              </div>
              <h4 className="itm" style={{ fontColor: "black" }}>
                {user.email}
              </h4>
              <p
                className="itm"
                style={{
                  fontFamily: "Gill Sans",
                  fontSize: "20px",
                  fontColor: "black",
                }}
              >
                {postContent}
              </p>
              <p
                className="itm"
                style={{
                  fontFamily: "math",
                  fontSize: "10px",
                  marginTop: "10px",
                  fontColor: "black",
                }}
              >
                {dt}
              </p>
              <div className="post-btn-container">
                <AiOutlineEdit
                  data-tip
                  data-for="editTip"
                  className="post-btn"
                  onClick={handleEdit}
                />
                <ReactTooltip id="editTip" place="top" effect="solid">
                  Edit
                </ReactTooltip>
                <AiOutlineDelete
                  data-tip
                  data-for="deleteTip"
                  className="post-btn"
                  onClick={handleDelete}
                />
                <ReactTooltip id="deleteTip" place="top" effect="solid">
                  Delete
                </ReactTooltip>
                <div style={{color:'#34b38d'}}>
                  <FaRegComment
                    data-tip
                    data-for="replyTip"
                    className="post-btn"
                    onClick={handleReply}
                  />

                  <ReactTooltip id="replyTip" place="top" effect="solid">
                    Reply
                  </ReactTooltip>
                  {replyCount}
                </div>
                <div data-tip data-for="likeTip">
                  {!postLiked ? (
                    <AiOutlineLike className="post-btn" onClick={addLike} />
                  ) : (
                    <AiTwotoneLike className="post-btn" onClick={unlikePost} />
                  )}
                  <label className="post-btn" style={{ marginLeft: "5px" }}>
                    {postLike}
                  </label>
                </div>
                <ReactTooltip id="likeTip" place="top" effect="solid">
                  likes
                </ReactTooltip>
              </div>
            </div>
          </section>

          {showReply ? <Replies posts={replyList} /> : null}
        </div>
      )}
    </>
  );
};

export default SinglePost;
