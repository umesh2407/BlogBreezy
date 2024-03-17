import { useEffect, useState } from "react";
import Post from "../components/post";

const IndexPage = () => {
const [post,setPost]=useState([]);

  useEffect(()=>{
fetch('http://localhost:8800/post').then(response =>{
  response.json().then(posts => {
console.log(posts);
  });
})
  },[])
  return (
   <>
   {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
   </>
  )
}

export default IndexPage;