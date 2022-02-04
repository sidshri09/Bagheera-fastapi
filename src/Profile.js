import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import {
  FaEnvelopeOpen,
  FaHeart,
  FaPhone,
  FaCalendarTimes,
  FaUserPlus,
  FaUserMinus,
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import moment from "moment";
import { useParams} from "react-router-dom";
import GetProfilePosts from "./GetProfilePosts";
import ReactTooltip from "react-tooltip";

export default function Profile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const [value, setValue] = useState("random person");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [newUser, setNewUser] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [followings, setFollowings] = useState(0)

  const getProdUrl = "https://fastapi-bagheera.herokuapp.com/posts";
  const getUrl = "http://localhost:8000/posts";

  const getUserUrl = "http://localhost:8000/users/" + id;
  const getProdUserUrl = "https://fastapi-bagheera.herokuapp.com/users/" + id;

  const postFollowingUrl = "https://fastapi-bagheera.herokuapp.com/followers";

  const getFollowingUrl = "https://fastapi-bagheera.herokuapp.com/followers/gurus";

  const getAllFollowings = async () => {
    const response = await fetch(`${getFollowingUrl}/${user.User.id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 404){
        setFollowings(0)
    }
    if (response.status === 200) {
      const follow = await response.json();
      console.log(follow);
      console.log("inside getAllFollowings")
      setFollowings(follow.length);
      
    } else {
      console.log(response.status);
    }
  };


  const openFollowersPage = () => {
    window.location.replace(
      `https://bagheerapost.com/followers/${user.User.id}`
    );
  };
  const openFollowingsPage = () => {
    window.location.replace(
      `https://bagheerapost.com/following/${user.User.id}`
    );
  };

  
  const addFollowing = async () => {
    const response = await fetch(postFollowingUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        following_id: user.User.id,
        follow_dir: true,
      }),
    });
    if (response.status === 201) {
      console.log("followed");
      console.log(response.json);
      setFollowed(true);
    } else {
      console.log(response.status);
    }
  };

  const unFollow = async () => {
    const response = await fetch(postFollowingUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        following_id: user.User.id,
        follow_dir: false,
      }),
    });
    if (response.status === 201) {
      console.log("followed");
      console.log(response.json);
      setFollowed(false);
    } else {
      console.log(response.status);
    }
  };

  const fetchUserPosts = async () => {
    const response = await fetch(getProdUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 200) {
      const user_posts = await response.json();
      console.log(user_posts);
      setPosts(user_posts);
      setPostLoading(false);
    } else {
      console.log(response.status);
    }
  };
  const fetchUserDetails = async () => {
    const response = await fetch(getProdUserUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 200) {
      const user_data = await response.json();
      console.log(user_data);
      setUser(user_data);
      setValue(user_data.User.email);
      setLoading(false);
    } else {
      console.log(response.status);
    }
  };
  useEffect(() => {
    fetchUserDetails();
    if (postLoading === false && posts === []) {
      setNewUser(true);
    }
  }, [getProdUserUrl, localStorage.getItem("accessToken")]);

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  useEffect(() => {
    getAllFollowings();
  },[user])



  const handleValue = (e) => {
    if (e.target.classList.contains("icon")) {
      setShowFollowers(false);
      setShowFollowings(false);
      const newValue = e.target.dataset.label;

      if (newValue === "CreatedAt") {
        const dt = moment(user.User.CreatedAt).format("MMMM D, YYYY");
        const val = `Joined ${dt}`;
        setValue(val);
        return;
      }
      if (newValue === "phone") {
        if (!user.User.phone) {
          setValue("**********");
          return;
        }
      }
      if (newValue === "followings") {
        setShowFollowings(true);
        return;
      }

      if (newValue === "followers") {
        setShowFollowers(true);
        return;
      }
      setValue(user.User[newValue]);
    }
  };

  if (!localStorage.getItem("loggedin")) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>Login to search friends</h3>
        <Loading />
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main>
          <main>
            <div className="block bcg-black"></div>
            <div className="block">
              <div className="person-container">
                <img
                  src={user.User.profile_pic}
                  alt="random user"
                  className="user-img"
                />
                {showFollowers ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p style={{fontFamily:'cursive'}} style={{fontWeight:'bold'}}>{user.followers} followers </p>
                  </div>
                ) : null}
                {showFollowings ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p style={{fontFamily:'cursive'}} style={{fontWeight:'bold'}}>{followings} followings</p>
                  </div>
                ) : null}
                <p className="user-value">{value}</p>

                <div className="values-list">
                  <button
                    className="icon"
                    data-label="followers"
                    data-tip
                    data-for="followers"
                    onMouseOver={handleValue}
                  >
                    <IoIosPeople onClick={openFollowersPage} />
                    <ReactTooltip id="followers" place="top" effect="solid">
                      followers
                    </ReactTooltip>
                  </button>
                  <button
                    className="icon"
                    data-label="followings"
                    data-tip
                    data-for="followings"
                    onMouseOver={handleValue}
                  >
                    <FaHeart onClick={openFollowingsPage} />
                    <ReactTooltip id="followings" place="top" effect="solid">
                      followings
                    </ReactTooltip>
                  </button>
                
                  <button
                    className="icon"
                    data-label="email"
                    onMouseOver={handleValue}
                  >
                    <FaEnvelopeOpen />
                  </button>

                  {/* <button
                    className="icon"
                    data-label="loc"
                    onMouseOver={handleValue}
                  >
                    <FaLocationArrow />
                  </button> */}
                  <button
                    className="icon"
                    data-label="phone"
                    onMouseOver={handleValue}
                  >
                    <FaPhone />
                  </button>
                  <button
                    className="icon"
                    data-label="CreatedAt"
                    onMouseOver={handleValue}
                  >
                    <FaCalendarTimes />
                  </button>
                  {followed ? (
                    <button className="icon" data-tip data-for="followingTip">
                      <FaUserMinus onClick={unFollow} />
                      <ReactTooltip
                        id="followingTip"
                        place="top"
                        effect="solid"
                      >
                        you're following {user.User.email}
                      </ReactTooltip>
                    </button>
                  ) : (
                    <button className="icon" data-tip data-for="followTip">
                      <FaUserPlus onClick={addFollowing} />
                      <ReactTooltip id="followTip" place="top" effect="solid">
                        follow
                      </ReactTooltip>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {newUser ? (
              <h1>You have no posts</h1>
            ) : (
              <GetProfilePosts
                posts={posts}
                loading={loading}
                email={user.User.email}
              />
            )}
          </div>
        </main>
      )}
    </>
  );
}
