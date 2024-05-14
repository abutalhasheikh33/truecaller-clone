import React from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
function Nav() {
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log('Logout clicked');
        toast.success('Logout successful');
        navigate('/');
        localStorage.removeItem("userToken");
    };

    return (
        <nav className='mx-2 py-2'>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md">Logout</button>
        </nav>
    );
}

export default Nav;