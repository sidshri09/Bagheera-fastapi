import React from 'react'

const Follower = ({ id, email, phone, CreatedAt, profile_pic }) => {
  const myArray = email.split("@");
  const openProfile=()=>{

    window.location.replace(`https://bagheerapost.com/profile/${email}`)
    // window.location.replace(`http://localhost:3000/profile/${email}`)

  }
  return (
    <article className='card' onClick={openProfile}>
      <img src={profile_pic} alt={email} />
      <h6>@{myArray[0]}</h6>
      {/* <a href={html_url} className='btn'>
        view profile
      </a> */}
    </article>
  )
}

export default Follower
