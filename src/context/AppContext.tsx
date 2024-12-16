import { createContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContextType, Tasks, UserData } from "../types";
import {  useNavigate } from "react-router-dom";


export const AppContext = createContext<AppContextType>({} as AppContextType);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | false>(false);
  
  const [tasks, setTasks] = useState<Tasks[]>([]);


  const getAuthState = async (): Promise<void> => {

    try {
      const { data } = await axios.get(backendUrl+"/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
         if (location.pathname === "/login") {
          navigate("/"); 
        }
      } else{
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };


  const getUserData = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };


  
  const getTaskData = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/task`);
      data.success ? setTasks(data.task) : toast.error(data.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  
  
  useEffect(() => {
    getTaskData()
  }, []);

    useEffect(() => {
    getAuthState();
  }, [ isLoggedIn ]);



  const value: AppContextType = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    getTaskData,
    tasks,
    setTasks
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
