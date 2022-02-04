import React, { useState, useEffect } from 'react';
import Alert from './Alert';

const useFetch = (getUrl) =>{
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([])
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

    const showAlert = (show = false, type = '', msg = '') => {
        setAlert({ show, type, msg });
      };

    useEffect(async() => {
        setLoading(true);
        const response = await fetch(getUrl+'?limit=100',{
            "method": "GET",
            "headers": {
                "accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        if (response.status === 404){
            showAlert(true, 'danger', 'There are no posts');
        }
        if (response.status === 200){
            const data = await response.json();
            setPosts(data)
            setLoading(false);
        }else{
            showAlert(true, 'danger', 'You\'re logged out');
        }
    }, [getUrl, localStorage.getItem('accessToken')])
    console.log(posts)
    return {loading, posts, alert}
}

export default useFetch