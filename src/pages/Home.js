import React from 'react';
import Signin from './Signin';
import Posts from '../Posts'


const Home = () => {
    console.log(localStorage.getItem("loggedin"))
    return(
        <main>
            {localStorage.getItem("loggedin")?<Posts/>:<Signin />}
        </main>
    )
}

export default Home