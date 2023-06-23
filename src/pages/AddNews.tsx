import "../style/addnews.scss"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from "firebase/firestore"; 
import { firestore } from "../firebase"; 
import { useNavigate } from 'react-router-dom';
import useOnliStatus from "../hook/useOnline";

const AddNews = () => {
    const [title, setTitle] = useState(''); 
    const [excerpt, setExcerpt] = useState(''); 
    const [content, setContent] = useState(''); 
    const [error, setError] = useState(''); 
    const [buttonDisabled, setButtonDisabled] = useState(false); 
    const unique_id = uuidv4();
    const navigate = useNavigate(); 
    useOnliStatus(); 

    useEffect(() => {
        if(localStorage.getItem("user") === undefined){
            navigate('/'); 
        }
        // eslint-disable-next-line
    }, [])

    const handleAddNews = () => {

        if(title.length === 0 || excerpt.length===0 || content.length===0){
            setError("Please fill all the fields above")
        }else{
            setButtonDisabled(true); 

            const date = new Date(); 
            const day = date.getDate().toString().length === 1 ? "0" + date.getDate() : date.getDate(); 
            const month = date.getMonth().toString().length === 1 ? "0" + (date.getMonth()+1) : date.getMonth()+1; 

            const dateString = `${date.getFullYear()}-${month}-${day}`
            const author = JSON.parse(localStorage.getItem("user") || '');
            console.log(author);
            const newsData = {
                id: unique_id,
                story_date: dateString,
                title: title,
                excerpt: excerpt,
                story_content: content,
                author: {
                    name: author.name,
                    email: author.email,
                    phone: author.phone,
                }, 
                ratings: {
                    upvotes: 0,
                    downvotes: 0,
                    rating: 5
                }
            }


            if(!navigator.onLine){
                const uploadArray = JSON.parse(localStorage.getItem("upload") || '[]'); 
                uploadArray.push(newsData); 
                localStorage.setItem("upload", JSON.stringify(uploadArray)); 

                toast("News will be uploaded when back online"); 
                setTimeout(() => {
                    navigate("/home"); 
                }, 3000)
            }else{
                const ref = doc(firestore, "news", unique_id); 
                setDoc(ref, newsData).then((response) => {
                    toast("News has been uploaded successfully");
                    
                    setTimeout(() => {
                        navigate("/home")
                    }, 3000 ); 
                }).catch(() => {
                    toast("There was a problem posting your news"); 
                    setButtonDisabled(false); 
                })
            }
        }
    }

    return(
        <div className="addNewsContent">
            <Nav/>
            <div className="addNewsModal">

                <h1>Please fill the content of the news</h1>

                <div className="formContainer">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>

                <div className="formContainer">
                    <label>Excerpt</label>
                    <textarea rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)}></textarea>
                </div>

                <div className="formContainer">
                    <label>Story Content</label>
                    <textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </div>

                <p className="error">{error}</p>

                <button onClick={handleAddNews} disabled={buttonDisabled}>{buttonDisabled ? '...' : 'Add News'}</button>
            </div>

            <ToastContainer />

        </div>
        
    )
}

export default AddNews