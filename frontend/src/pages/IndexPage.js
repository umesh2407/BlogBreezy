import { useEffect, useState } from "react";
import Post from "../components/post";

const IndexPage = () => {
const [post,setPost]=useState([]);

  useEffect(()=>{
fetch('https://blog-app-server-pi.vercel.app/post').then(response =>{
  response.json().then(posts => {
    setPost(posts);
  });
})
  },[])
  return (
   <>
   {post.length > 0 && post.map(post => (
        <Post {...post} />
      ))}
   </>
  )
}

export default IndexPage;