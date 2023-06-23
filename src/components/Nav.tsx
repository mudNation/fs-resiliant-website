import "../style/nav.scss"; 
import { useNavigate } from 'react-router-dom';


const Nav = () => {
    const navigate = useNavigate(); 

    const logOut = () => {
        localStorage.removeItem("user"); 
        navigate('/'); 
    }

    return(
        <ul className="navContent">
            <li onClick={() => navigate("/home")}>Home</li>
            <li onClick={() => navigate("/add")}>Add News</li>
            <li onClick={logOut}>Logout</li>
        </ul>
    )
}

export default Nav; 