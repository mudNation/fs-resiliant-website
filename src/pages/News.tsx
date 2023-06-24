import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { NewsType, RatingUpdate, Rating } from "../types";
import "../style/news.scss"; 
import { firestore } from "../firebase"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, setDoc, runTransaction, addDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import useOnliStatus from "../hook/useOnline";



const News = () => {
    const { id } = useParams();  
    const navigate = useNavigate(); 

    const [newsInfo, setNewsInfo] = useState<NewsType>(); 
    const [voted, setVoted] = useState(''); 

    useOnliStatus(); 


    useEffect(() => {
        if(localStorage.getItem("user") === undefined){
            navigate('/'); 
        }

        const newsData: NewsType[] = JSON.parse(localStorage.getItem('news') || '[]'); 
        const tempNewsInfo: NewsType | undefined = newsData.find((news) => news.id === id); 
        setNewsInfo(tempNewsInfo)

        downloadUserRating(); 
        // eslint-disable-next-line
    }, [])

    const downloadUserRating = () => {
        const userDetails = JSON.parse(localStorage.getItem("user") || ""); 

        const ref = query(collection(firestore, "votes"), where("userid", "==", userDetails.id), where("newsid", "==", id));
        getDocs(ref).then((response) => {
            if(response.docs.length > 0){
                setVoted(response.docs[0].data().vote); 
            }
        })
    }

    const handleVoteClick = (vote: string) => {
        if(vote === voted){
            return; 
        }

        setVoted(vote); 
        const userDetails = JSON.parse(localStorage.getItem("user") || ''); 

        if(navigator.onLine){
            updateRating({vote: vote, userId: userDetails.id, newsId: id || ''}); 
        }else{
            let ratingsArray: RatingUpdate[] = JSON.parse(localStorage.getItem("ratings") || '[]'); 
            const existingRating = ratingsArray.find((rating) => rating.userId === userDetails.id && rating.newsId === id)
            
            if(existingRating === undefined){
                ratingsArray.push({
                    vote: vote,
                    userId: userDetails.id,
                    newsId: id || '',
                })
            }else{
                ratingsArray = ratingsArray.map((rating) => {
                    if(rating.userId === existingRating.userId && rating.newsId === existingRating.newsId){
                        return {...rating, vote: vote}
                    }else{
                        return rating; 
                    }
                })
            }

            toast("Changes would be made when you come online");

            localStorage.setItem("ratings", JSON.stringify(ratingsArray)); 
        }
    }

    const updateRating = (ratingUpdate: RatingUpdate) => {
        const ref = query(collection(firestore, "votes"), where("userid", "==", ratingUpdate.userId), where("newsid", "==", ratingUpdate.newsId));
        getDocs(ref).then((response) => {
            
            if(response.docs.length === 0){
                uploadFirstRating(ratingUpdate)
            }else{
                updatePreviousRating(ratingUpdate, response.docs[0].data().vote, response.docs[0].id); 
            }
        })
    }

    const uploadFirstRating = (ratingUpdate: RatingUpdate) => {
        const updateRef = collection(firestore, "votes"); 
        addDoc(updateRef, {
            vote: ratingUpdate.vote,
            userid: ratingUpdate.userId,
            newsid: ratingUpdate.newsId,
        }).then(() => {
            const postRef = doc(firestore, "news", ratingUpdate.newsId); 
        
            runTransaction(firestore, async (transaction) => {
                const sfDoc = await transaction.get(postRef);
                if (sfDoc.exists()) {
                    if(ratingUpdate.vote === "up"){
                        const newVote = sfDoc.data().ratings.upvotes + 1;
                        const newRating = (newVote * 5) / (newVote + sfDoc.data().ratings.downvotes); 
                        transaction.update(postRef, { ratings: {upvotes: newVote, downvotes: sfDoc.data().ratings.downvotes, rating: newRating } });
    
                        updateNewsInfo({upvotes: newVote, downvotes: sfDoc.data().ratings.downvotes, rating: newRating }); 
    
                    }else{
                        const newVote = sfDoc.data().ratings.downvotes + 1;
                        const newRating = (sfDoc.data().ratings.upvotes * 5) / (newVote + sfDoc.data().ratings.upvotes); 
                        transaction.update(postRef, { ratings: {upvotes: sfDoc.data().ratings.upvotes, downvotes: newVote, rating: newRating } });
    
                        updateNewsInfo({upvotes: sfDoc.data().ratings.upvotes, downvotes: newVote, rating: newRating }); 
                    }
                }
                
                
            });
        })
    }

    const updateNewsInfo = (ratings: Rating) => {
        const tempNewsInfo:NewsType|undefined = newsInfo; 
        tempNewsInfo!.ratings = {upvotes: ratings.upvotes, downvotes: ratings.downvotes, rating: ratings.rating}
        setNewsInfo({...newsInfo, ratings:ratings}); 
    }

    const updatePreviousRating = (ratingUpdate: RatingUpdate, vote: string, voteId: string) => {
        if(vote !== ratingUpdate.vote){

            const updateRef = doc(firestore, "votes", voteId); 
            setDoc(updateRef, {
                vote: ratingUpdate.vote,
                userid: ratingUpdate.userId,
                newsid: ratingUpdate.newsId,
            }).then(() => {
                const postRef = doc(firestore, "news", ratingUpdate.newsId); 
                runTransaction(firestore, async (transaction) => {
                    const sfDoc = await transaction.get(postRef);
                    if (sfDoc.exists()) {
                        if(ratingUpdate.vote === "up"){
                            const voteData = sfDoc.data(); 
    
                            const upvotes = voteData.ratings.upvotes + 1;
                            const downvotes = voteData.ratings.downvotes - 1;
                            const newRating = (upvotes * 5) / (downvotes + upvotes); 
                            
                            transaction.update(postRef, { ratings: {upvotes: upvotes, downvotes: downvotes, rating: newRating } });
                            updateNewsInfo({upvotes: upvotes, downvotes: downvotes, rating: newRating });
                        }else{
                            const downvotes = sfDoc.data().ratings.downvotes + 1;
                            const upvotes = sfDoc.data().ratings.upvotes - 1;
                            const newRating = (upvotes * 5) / (upvotes + downvotes); 
    
                            transaction.update(postRef, { ratings: {upvotes: upvotes, downvotes: downvotes, rating: newRating } });
                            updateNewsInfo({upvotes: upvotes, downvotes: downvotes, rating: newRating });
                        }
                    }
                    
                    
                });
            })
        }
    }

    return(
        <div className="singleNewsContent">
            <Nav/>

            <h1>{newsInfo?.title}</h1>
            <h2>{newsInfo?.excerpt}</h2>
            <p className="story_content">
                {newsInfo?.story_content}
            </p>

            <div className="rating">
                <div className= {voted==="up" ? "chevRating chevRatingClicked" : "chevRating"} onClick={() => handleVoteClick("up")}>
                    <p>UP</p>
                </div>
                <div><p>{newsInfo?.ratings !== undefined ? newsInfo.ratings.rating : ''}</p></div>
                <div className={voted==="down" ? "chevRating chevRatingClicked" : "chevRating"} onClick={() => handleVoteClick("down")}>
                    <p>DOWN</p>
                </div> 
            </div>

            <p className="authorDet firstAuthor">Author Name: {newsInfo?.author !== undefined ? newsInfo?.author.name : ''}</p>
            <p className="authorDet">Author Email: {newsInfo?.author !== undefined ? newsInfo?.author.email : ''}</p>
            <p className="authorDet">Author Phone: {newsInfo?.author !== undefined ? newsInfo?.author.phone : ''}</p>
            <p className="authorDet">Date Entered: {newsInfo?.story_date}</p>

            <ToastContainer />
        </div>
        
    )
}

export default News; 