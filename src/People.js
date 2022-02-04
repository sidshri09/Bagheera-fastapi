import React, { useState } from "react";
import Person from "./Person";
import Loading from "./Loading";
import {FaSearch} from 'react-icons/fa'


const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const searchUrl = "http://localhost:8000/users";
  const searchProdUrl = "https://fastapi-bagheera.herokuapp.com/users";

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
    return (<div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <h3 style={{fontFamily:'cursive'}}>
        Login to search friends
      </h3>
      <Loading />
      </div>
    );
  }

  return (
    <section className="section-center" style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <form
        style={{
          width: "700px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        className="grocery-form"
      >
        <h3 style={{fontFamily:'cursive'}}>Lookup Your Friend</h3>
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
            <div>
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
      }}>
      {showSearchResult
        ? searchResult.map((user) => {
            const {User, followers} = user
            const {id, email, phone, CreatedAt, profile_pic} = User
            return <Person key={id} person={user} />;
          })
        : null}
        </div>
    </section>
  );
};
export default Search;
