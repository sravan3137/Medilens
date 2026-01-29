import { createContext, useState, useEffect } from "react";
import API from "../src/api";
import { Link,Navigate} from "react-router-dom";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connection,setConnection] = useState(null);
  useEffect(() => {
    const fetchUserProfile = async()=>{
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if(!username){
        setLoading(false);
        return;
      }
      try {
        const res = await API.get("/users/profile",{
          params:{username:username}
        });
        // console.log("profile retrieved:",res.data);
        setUser(res.data.user);
      } catch(e) {
        localStorage.removeItem("token");
      }finally{
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // 🔹 Login (by username)
  const login = async (username, password) => {
    const res = await API.post("/users/login", { username, password });
    if(res.status===401) {
      return <Navigate to="/pnf" replace />;
    }
    console.log("Login Message:"+res.message);
    console.log("R:",res.data);
    if(res.data.user) {
      setUser(res.data.user);
      localStorage.setItem("username",res.data.user.username);
    }
    console.log("Exiting login");
    return res;
    // const profile = await API.get("/users/profile");
    // setUser(profile.data);
  };

  // 🔹 Signup (username + email + password)
  const signup = async (username, email, role,password) => {
    const res = await API.post("/users/register", { username, email, role,password });
    if(res.status===401) {
      return <Navigate to="/login" replace />;
    }
    if(res.data.user) return login(username, password);
    console.log("e at AuthContext"+res.data.message);
    // auto-login after signup
    return res;
  };

  const logout = async() => {
    try{
      // const res = await API.get("/users/logout");
      // if(res.status===401) {
      //   setUser(null);
        
      // }
      // console.log("OK");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      
      setUser(null);
      return <Navigate to="/login" replace />;
    }catch(e){
      console.log("Error occurred");
      return false;
    }
  };
  const setConn= async(user_id)=>{
    setConnection(user_id);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout,setConn,connection }}>
      {children}
    </AuthContext.Provider>
  );
};
