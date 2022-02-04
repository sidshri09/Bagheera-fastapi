import React, { Component } from "react";
import moment from "moment";

const Person = ({ person }) => {
  const {User, followers} = person
  const {id, email, phone, CreatedAt, profile_pic} = User
  let dt = moment(CreatedAt).format("MMMM D, YYYY, h:mm:ss a");

  const openProfile=()=>{

    window.location.replace(`https://bagheerapost.com/profile/${email}`)
    //  window.location.replace(`http://localhost:3000/profile/${email}`)

  }


  return (
    <section key={id} className="item" onClick={openProfile}>
      <div>
        <div className="img-container" style={{ marginTop: "15px" }}>
          <img
            style={{ width: "100px", height: "100px" }}
            className="person-img"
            src={profile_pic}
          ></img>
        </div>
        <h4>{email}</h4>
        <p
          style={{
            fontFamily: "math",
            fontSize: "10px",
            marginTop: "10px",
          }}
        >
          Joined on {dt}
        </p>
      </div>
    </section>
  );
};

export default Person;
