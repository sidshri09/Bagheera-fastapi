import React, { useState } from "react";
import SinglePost from "./SinglePost";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import {FaSearch} from 'react-icons/fa'

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const searchUrl = "http://localhost:8000/posts";
  const searchProdUrl = "https://fastapi-bagheera.herokuapp.com/posts";
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    const response = await fetch(`${searchProdUrl}?search=${searchTerm}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const data = await response.json();

    if (response.status === 200) {
      setSearchResult(data);
      console.log(data);
    }

    setShowSearchResult(true);
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
        <h3 style={{fontFamily:'cursive'}}>Login to search</h3>
        <Loading />
      </div>
    );
  }
  return (
    <>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', marginTop:'100px'}}>
        <Link to="/people"><button className="member-search-btn" style={{fontFamily:'cursive'}}>Search Members</button></Link>
        <div className="underline"></div>
      </div>
      <section
        className="section-center"
        style={{
          display: "flex",
          flexDirection: "column",
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
          <h3 style={{fontFamily:'cursive'}}>Search Posts</h3>
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
              <div className="form-control">
                <input
                  className="search-input"
                  type="text"
                  id="content"
                  value={searchTerm}
                  placeholder="What's on your mind?"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <button style={{fontSize:'medium', paddingTop:'10px'}} className="member-search-btn" type="submit" onClick={handleSearch}>
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </form>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showSearchResult
            ? searchResult.map((post) => {
                return <SinglePost key={post.Post.id} post={post} />;
              })
            : null}
        </div>
      </section>
    </>
  );
};
export default Search;
