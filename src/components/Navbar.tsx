import { useContext } from 'react';
// import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/assets';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);



  const logout = async (): Promise<void> => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };


  return(
        <div className='w-full flex items-center justify-between p-4 sm:p-6 sm:px-24 absolute top-0'>
    <h2 className='text-2xl sm:text-3xl font-bold text-indigo-800 border rounded-full
     border-indigo-800 px-4  '>Task Manager</h2>
      {
        userData ?
          <div className='flex justify-center items-center h-8 w-8 rounded-full bg-black text-white relative group'>
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
              <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>

                <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
              </ul>
            </div>
          </div> : <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all' onClick={() => navigate('/login')}>Login <img src={assets.arrow_icon} alt="" /></button>
      }
    </div>
  )
};

export default Navbar;
