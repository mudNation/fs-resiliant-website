import { useNavigate } from 'react-router-dom';
import '../style/login.scss'; 
import LoginModal from '../components/LoginModal';
import { useEffect, useState } from 'react';
import { firestore } from "../firebase"; 
import { collection, getDocs, query, where } from "@firebase/firestore"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOnliStatus from '../hook/useOnline';


const Login = () => {
    const navigate = useNavigate(); 
    const [error, setError] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState(false); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    useOnliStatus(); 


    const handleLogin = () => {
        if(!navigator.onLine){
            toast("Please connect to the internet to login")
            return; 
        }

        if(email.length === 0 || password.length === 0){
            setError("Please fill all details")
        }else{
            let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            if(!email.match(validRegex)){
                setError("Email is in wrong format"); 
                return; 
            }


            setButtonDisabled(true); 
            const ref = query(collection(firestore, "user"), where("email", "==", email), where("password", "==", password)); 
            getDocs(ref).then((response) => {
                if(response.docs.length === 0){
                    setError("No match for email and password"); 
                    setButtonDisabled(false); 
                }else{
                    let userDetails = {
                        id: response.docs[0].id,
                        name: response.docs[0].data().name,
                        email: response.docs[0].data().email,
                        password: response.docs[0].data().password,
                        phone: response.docs[0].data().phone,
                    }
                    localStorage.setItem("user", JSON.stringify(userDetails)); 
                    navigate("/home");
                }

            }).catch((error) => alert("Error login in")); 
        }
    }

    useEffect(() => {
        if(localStorage.getItem("user") !== null){
            navigate("/home"); 
        }
    }, [])

    const openSignUp = () => {
        navigate('/signup'); 
    }

    return (
        <>
            <LoginModal mode="Login" onSubmit={handleLogin} onAlternate={openSignUp} error={error} disabled={buttonDisabled}>
                <>
                    <input type='email' placeholder='Your Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type='password' placeholder='Your Password'value={password} onChange={(e) => setPassword(e.target.value)} />
                </>
            </LoginModal>

            <ToastContainer />
        </>
        
    )
}

export default Login; 

