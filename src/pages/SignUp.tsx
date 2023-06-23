import LoginModal from '../components/LoginModal';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { firestore } from "../firebase"; 
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore"
import 'react-toastify/dist/ReactToastify.css';
import useOnliStatus from '../hook/useOnline';
import { ToastContainer, toast } from 'react-toastify';


const SignUp = () => {
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [phone, setPhone] = useState(''); 
    const [error, setError] = useState(' '); 
    const [buttonDisabled, setButtonDisabled] = useState(false); 

    const navigate = useNavigate(); 
    useOnliStatus(); 

    const handleSignUp = () => {
        if(!navigator.onLine){
            toast("Please connect to the internet"); 
            return; 
        }

        if(name.trim().length === 0 || email.trim().length===0 || phone.trim().length===0 || password.trim().length===0){
            setError("Please Fill all details"); 
        }else{
            let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            if(!email.match(validRegex)){
                setError("Please enter a valid email"); 
                return; 
            }

            // let phoneRegex = /^\d{10}$/
            // if(!phone.match(phoneRegex)){
            //     setError("Please enter a valid phone number"); 
            //     return; 
            // }


            setError(""); 
            setButtonDisabled(true); 

            const ref = query(collection(firestore, "user"), where("email", "==", email)); 
            getDocs(ref).then((response) => {
                if(response.docs.length > 0){
                    setError("Email address already exists")
                    setButtonDisabled(false); 
                }else{
                    const ref = collection(firestore, 'user'); 
                    addDoc(ref, {
                        name: name, 
                        email: email,
                        phone: phone, 
                        password: password,
                    }).then(() => {
                        navigate('/'); 
                    }).catch(() => alert("Error signing up"))
                   
                }
            }).catch(() => alert("error")); 
        }
    }

    const openLogin = () => {
        navigate('/')
    }

    return(
        <>
            <LoginModal mode="Sign Up" onSubmit={handleSignUp} onAlternate={openLogin} error={error} disabled={buttonDisabled}>
                <>
                    <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
                    <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type='phone' placeholder='Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)}/>
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </>
            </LoginModal>

            <ToastContainer />
        </>
        
    )
}

export default SignUp; 