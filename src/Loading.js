import React from 'react';
import logo from './loading.gif'

const Loading =()=>{
    return(<div style={{display:'grid', flexDirection:'row', justifyContent:'center'}}>
        <img style={{width:'100%', background:'transparent'}} src={logo}/></div>)
    
} 

export default Loading