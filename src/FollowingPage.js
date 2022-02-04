import React, { useState, useEffect } from 'react'
import FollowerCard from './FollowerCard'
import paginate from './utils'
import Loading from './Loading'
import { useParams } from "react-router-dom";


function FollowerPage() {
  const { id } = useParams()
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [followers, setFollowers] = useState([])
  const [data, setData] = useState([])
  const [showError, setShowError] = useState(false)

  const postFollowingUrl = "https://fastapi-bagheera.herokuapp.com/followers/gurus";

  const getAllFollowers = async () => {
    const response = await fetch(`${postFollowingUrl}/${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 404){
        setShowError(true)
    }
    if (response.status === 200) {
      const follow = await response.json();
      console.log(follow);
      setData(paginate(follow));
      setLoading(false)
      
    } else {
      console.log(response.status);
    }
  };

  useEffect(()=>{
    getAllFollowers()
  },[id,postFollowingUrl])

  useEffect(() => {
    if (loading) return
    setFollowers(data[page])
  }, [loading, page])

  const nextPage = () => {
    setPage((oldPage) => {
      let nextPage = oldPage + 1
      if (nextPage > data.length - 1) {
        nextPage = 0
      }
      return nextPage
    })
  }
  const prevPage = () => {
    setPage((oldPage) => {
      let prevPage = oldPage - 1
      if (prevPage < 0) {
        prevPage = data.length - 1
      }
      return prevPage
    })
  }

  const handlePage = (index) => {
    setPage(index)
  }

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
      <div className='section-title'>
        <h3 style={{fontFamily:'cursive'}}>{loading ? <Loading /> : 'Followings' }</h3>
        <h3 style={{fontFamily:'cursive'}}>{showError?'You have no followings':null}</h3>
        <div className='underline'></div>
      </div>
      <section className='followers'>
        <div className='container'>
          {followers.map((follower) => {
            return <FollowerCard key={follower.id} {...follower} />
          })}
        </div>
        {!loading && (
          <div className='btn-container'>
            <button className='prev-btn' onClick={prevPage}>
              prev
            </button>
            {data.map((item, index) => {
              return (
                <button
                  key={index}
                  className={`page-btn ${index === page ? 'active-btn' : null}`}
                  onClick={() => handlePage(index)}
                >
                  {index + 1}
                </button>
              )
            })}
            <button className='next-btn' onClick={nextPage}>
              next
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default FollowerPage
