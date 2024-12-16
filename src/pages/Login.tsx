import { useContext, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<"Sign Up" | "Login">("Sign Up");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
        if (data?.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return  (
     <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
     
       <h2 className='absolute left-5 sm:left-20 top-5 pb-1 cursor-pointer text-2xl sm:text-3xl font-bold text-indigo-800 border rounded-full
     border-indigo-800 px-4  '>Task Manager</h2>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "Sign Up" ? "Create  account" : "Login"}</h2>
        <p className='text-center text-sm mb-6'>{state === "Sign Up" ? "Create your account" : "Login to your account"}</p>
        <form onSubmit={onSubmitHandler} >

          {state === "Sign Up" &&
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
              <img src={assets.person_icon} alt="" />
              <input onChange={(e) => setName(e.target.value)}
                value={name} type="text" placeholder='Fullname' required className='bg-transparent outline-none' />
            </div>
          }

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={(e) => setEmail(e.target.value)}
              value={email} type="email" placeholder='Email' required className='bg-transparent outline-none' />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
            <img src={assets.lock_icon} alt="" />
            <input onChange={(e) => setPassword(e.target.value)}
              value={password} type="password" placeholder='Password' required className='bg-transparent outline-none' />
          </div>

       
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>

        {state === "Sign Up" ?
          <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{" "} <span className='text-blue-400 underline cursor-pointer' onClick={() => setState("Login")}>  Login here</span></p>
          :

          <p className='text-gray-400 text-center text-xs mt-4'>Don't hava en account?{" "} <span className='text-blue-400 underline cursor-pointer' onClick={() => setState("Sign Up")}> Sign up</span></p>
        }
      </div>
    </div>
  )
};

export default Login;
