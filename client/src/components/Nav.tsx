import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/Store";
import { removeUser } from "../redux/Slices/userSlices";




function Nav() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    


    const handleLogout = () => {
        console.log("Logout clicked");
        toast.success("Logout successful");
        localStorage.removeItem("userToken");
        dispatch(removeUser())
        navigate("/");

    };

    const details = useSelector((state: RootState) => state.user.userDetails);
    console.log("userdetails", details);

    return (
        <nav className="px-2 py-2 flex justify-between bg-gray-800 dark:bg-gray-900">
            <Link to="/contacts" className="text-gray-200 font-bold text-2xl">
                Truecaller-Clone
            </Link>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
                Logout
            </button>
        </nav>
    );
}

export default Nav;
