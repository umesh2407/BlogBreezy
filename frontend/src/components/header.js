import { useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";


const Header = () => {
const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(()=>{
    fetch('http://localhost:8800/profile',{
      credentials:'include',
    }).then(response => {response.json().then(userInfo =>{
      setUserInfo(userInfo);

    })
    })
  },[]);

function logout(){
  fetch('http://localhost:8800/logout',{
    credentials: 'include',
    method:'POST'
  });

  setUserInfo(null);
}

const username = userInfo?.username;

  return (
    <header>
    <Link to="/" className="logo">MyBlog</Link>
    <nav>
      {username && (
        <>
        <Link to="/create">Create new post</Link>
        <a onClick={logout}>Log Out</a>
        </>
      )}
      {!username && (
        <>
         <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
        </>
      )}
     
    </nav>
  </header>
  )
}

export default Header;