import React, { Component } from 'react';
import SinglePost from './SinglePost';


const Replies =({posts})=>{

    return( <div style={{display:'flex', flexDirection:'column-reverse', justifyContent:'center', alignItems:'center'}}>
    {posts.map((post) => {
      return(<SinglePost key={post.Post.id} post={post} />)
    })}
</div>)
}

export default Replies