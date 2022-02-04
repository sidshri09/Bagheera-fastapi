import React, { useEffect, useState } from "react";
import GetPosts from "./GetPosts";
import PostPost from "./PostPost";
import Helmet from "react-helmet";
import logo from "./149120.svg";
import useFetch from "./useFetch";
import Loading from "./Loading";
import {
  FaEnvelopeOpen,
  FaHeart,
  FaUser,
  FaOrcid,
  FaLocationArrow,
  FaPhone,
  FaCalendarTimes,
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import moment from "moment";
import useGeolocation from "react-hook-geolocation";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";


const Posts = () => {
  const [s3uri, setS3uri] = useState("");
  const getProdUrl = "https://fastapi-bagheera.herokuapp.com/posts";
  const getUrl = "http://localhost:8000/posts";
  const [newUser, setNewUser] = useState(false);
  const { loading, posts, alert } = useFetch(getProdUrl);
  const loggedout = alert.show;
  const [value, setValue] = useState("random person");
  const geolocation = useGeolocation();
  const [showMap, setShowMap] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [followings, setFollowings] = useState(0)


  const [user, setUser] = useState({});
  const getUserUrl =
    "http://localhost:8000/users/" + localStorage.getItem("user_id");
  const getProdUserUrl =
    "https://fastapi-bagheera.herokuapp.com/users/" +
    localStorage.getItem("user_id");

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
  

  if (loading === false && posts === []) {
    setNewUser(true);
  }

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
      setUserLoading(false);
    } else {
      console.log(response.status);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [getProdUserUrl, localStorage.getItem("accessToken")]);

  useEffect(() => {
    getAllFollowings();
  },[user])

  const handleValue = (e) => {
    if (e.target.classList.contains("icon")) {
      setShowMap(false);
      setShowFollowers(false);
      setShowFollowings(false);
      const newValue = e.target.dataset.label;
      if (newValue === "name") {
        var mail = user.User.email;
        var arr = mail.split("@");
        setValue(arr[0]);
        return;
      }
      if (newValue === "email") {
        var mail = user.User.email;
        setValue(mail);
        return;
      }
      if (newValue === "id") {
        setValue(user.User.id);
        return;
      }
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
      if (newValue === "loc") {
        var str;
        if (
          !geolocation.error &&
          geolocation.latitude !== null &&
          geolocation.longitude !== null
        ) {
          str = ``;
          setShowMap(true);
        } else {
          str = "Location not found. Enable location sharing";
        }
        setValue(str);
        return;
      }
      if (newValue === "followings") {
        setShowFollowings(true);
        return;
      }

      if (newValue === "followers") {
        setShowFollowers(true);
        return;
      }
      setValue(user[newValue]);
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
    <main>
      <Helmet>
        <link rel="icon" href={logo} />
        <title>Bagheera Post</title>
      </Helmet>
      {userLoading ? (
        <Loading />
      ) : (
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
                    <p style={{fontFamily:'cursive'}} className='user-value'>{user.followers} followers </p>
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
                    <p style={{fontFamily:'cursive'}} className="user-value">{followings} followings</p>
                  </div>
                ) : null}
              {showMap ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Link
                    to={`/map/${geolocation.latitude}/${geolocation.longitude}`}
                  >
                    <p style={{fontFamily:'cursive'}} className="user-loc">Open Map</p>
                  </Link>
                </div>
              ) : null}
              {(!showFollowers&&!showFollowings&&!showMap)?<p className="user-value">{value}</p>:null}

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

                <button
                  className="icon"
                  data-label="loc"
                  onMouseOver={handleValue}
                >
                  <FaLocationArrow />
                </button>
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
              </div>
            </div>
          </div>
        </main>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PostPost />
        {newUser ? (
          <h1>You have no posts</h1>
        ) : (
          <GetPosts posts={posts} loading={loading} />
        )}
      </div>
    </main>
  );
};

export default Posts;
