import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, setDoc, collection, query, where, getDocs, runTransaction, addDoc } from "firebase/firestore"; 
import { firestore } from "../firebase"; 
import { NewsType } from "../types";
import { RatingUpdate } from "../types";


const useOnliStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine); 
    const [count, setCount] = useState(0); 

    const updateNews = (upload: NewsType[]) => {
        for(let i = 0; i < upload.length; i++){
            const ref = doc(firestore, "news", upload[i].id || ''); 
            setDoc(ref, upload[i]).then((response) => {
                
            })
        }
    }

    const updateAllRatings = (ratings: RatingUpdate[]) => {
        for(let i = 0; i < ratings.length; i++){
            updateRating(ratings[i]); 
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
                    }else{
                        const newVote = sfDoc.data().ratings.downvotes + 1;
                        const newRating = (sfDoc.data().ratings.upvotes * 5) / (newVote + sfDoc.data().ratings.upvotes); 
                        transaction.update(postRef, { ratings: {upvotes: sfDoc.data().ratings.upvotes, downvotes: newVote, rating: newRating } });
                    }
                }
            });
        })
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
                        }else{
                            const downvotes = sfDoc.data().ratings.downvotes + 1;
                            const upvotes = sfDoc.data().ratings.upvotes - 1;
                            const newRating = (upvotes * 5) / (upvotes + downvotes); 
    
                            transaction.update(postRef, { ratings: {upvotes: upvotes, downvotes: downvotes, rating: newRating } });
                        }
                    }
                });
            })
        }
    }

    const syncApp = () => {
        let upload = JSON.parse(localStorage.getItem("upload") || '[]');
        if(upload.length > 0){
            updateNews(upload)
        }

        let ratings = JSON.parse(localStorage.getItem("ratings") || '[]'); 
        if(ratings.length > 0){
            updateAllRatings(ratings); 
        }

        localStorage.removeItem("upload"); 
        localStorage.removeItem("ratings")
    }

    useEffect(() => {
        if(count > 1){

            toast(isOnline ? "You are back online" : "You just went offline"); 

            if(navigator.onLine){
                syncApp(); 
            }
        }else{
            setCount(prevCount => prevCount+1); 
        }
        

        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
          };
      
          // Listen to the online status
          window.addEventListener('online', handleStatusChange);
      
          // Listen to the offline status
          window.addEventListener('offline', handleStatusChange);
      
          // Specify how to clean up after this effect for performance improvment
          return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
          };

          alert(" in here "); 
          // eslint-disable-next-line
    }, [isOnline])

    return {
        updateRating: updateRating,
    }
}

export default useOnliStatus; 