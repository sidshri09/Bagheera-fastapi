import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../Loading";
import Replies from "../Replies";
import { FaRegComment } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import {
  TwitterIcon,
  TwitterShareButton,
  FacebookIcon,
  FacebookShareButton,
  EmailIcon,
  EmailShareButton,
} from "react-share";
import {
  AiOutlineLike,
  AiTwotoneLike,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMore,
} from "react-icons/ai";

export default function SinglePagePost() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  const getPostUrl = "http://localhost:8000/posts/";
  const getPostProdUrl = "https://fastapi-bagheera.herokuapp.com/posts/";

  const getProdUrl = "https://fastapi-bagheera.herokuapp.com/posts";
  const voteProdUrl = "https://fastapi-bagheera.herokuapp.com/votes";
  const getUrl = "http://localhost:8000/posts";
  const voteUrl = "http://localhost:8000/votes";

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

  useEffect(async () => {
    try {
      const response = await fetch(`${getPostProdUrl}${id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      console.log(data.Post.user.profile_pic);
      setPost(data.Post);
      setPostLike(data.votes);
      setPostContent(data.Post.content);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
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
      setAnyReply(false);
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
      window.location.replace(`https://bagheerapost.com`);
    }
    if (response.status === 404) {
      setPostDeleted(true);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleReply = () => {
    console.log("inside handleReply");
    setPostReply(true);
  };

  if (loading) {
    console.log("loading -> ", loading);
    return <Loading />;
  }
  if (!loading) {
    return (
      <>
        {postDeleted ? null : editing ? (
          <section className="section-center">
            <form className="grocery-form">
              <div className="form-control">
                <input
                  type="text"
                  id="content"
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
                <button
                  className="button"
                  type="submit"
                  onClick={postReplyFunc}
                >
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
            }}
          >
            <section key={id} className="post-item">
              {post.parent_post === null ? null : (
                <Link to={`/post/${post.parent_post}`}>
                  <AiOutlineMore />
                </Link>
              )}
              <div className="item-center">
                <div className="img-container" style={{ marginTop: "15px" }}>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    className="person-img"
                    src={post.user.profile_pic}
                  ></img>
                </div>
                <h4>{post.user.email}</h4>

                <p style={{ fontFamily: "Gill Sans", fontSize: "20px" }}>
                  {post.content}
                </p>
                <p
                  style={{
                    fontFamily: "math",
                    fontSize: "10px",
                    marginTop: "10px",
                  }}
                >
                  {moment(post.CreatedAt).format("MMMM D, YYYY, h:mm:ss a")}
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
                  <div style={{ color: "#34b38d" }}>
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
                      <AiTwotoneLike
                        className="post-btn"
                        onClick={unlikePost}
                      />
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
              <div
                data-tip
                data-for="socialTip"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TwitterShareButton url={window.location.href}>
                  <TwitterIcon className="social-icon" size={16} round={true} />
                </TwitterShareButton>
                <FacebookShareButton url={window.location.href}>
                  <FacebookIcon
                    className="social-icon"
                    size={16}
                    round={true}
                  />
                </FacebookShareButton>
                <EmailShareButton url={window.location.href}>
                  <EmailIcon className="social-icon" size={16} round={true} />
                </EmailShareButton>
              </div>
              <ReactTooltip id="socialTip" place="top" effect="solid">
                Share
              </ReactTooltip>
            </section>
            <Replies posts={replyList} />
          </div>
        )}
      </>
    );
  }
}
