import { useNavigate } from 'react-router-dom';
import "../style/home.scss"; 
import Nav from '../components/Nav';
import useOnliStatus from '../hook/useOnline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from "react-paginate";
import { useEffect, useState } from 'react';
import { NewsType } from '../types';
import { firestore } from "../firebase"; 
import { collection, getDocs} from "@firebase/firestore"; 

const Home = () => {
    const navigate = useNavigate(); 
    useOnliStatus(); 

    const [newsData, setNewsData] = useState<NewsType[]>([])
    const [search, setSearch] = useState(''); 
    const usedNewsData = newsData.filter((news)=> news.title !== undefined && news.title.toLowerCase().indexOf(search.toLocaleLowerCase()) !== -1); 
    const pagesCount = usedNewsData.length/10; 
    const [currentPage, setCurrentPage] = useState(0); 
    const displayArray = usedNewsData.splice(currentPage*10, 10); 
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        if(localStorage.getItem("user") === undefined){
            navigate('/'); 
        }

        setLoading(true); 

        if(navigator.onLine){
            
            const ref = collection(firestore, "news"); 
            getDocs(ref).then((response) => {
                const tempNewsData:  NewsType[] = []; 

                response.docs.forEach((doc) => {
                    tempNewsData.push(doc.data() as NewsType); 
                })

                setNewsData([...tempNewsData]); 
                localStorage.setItem("news", JSON.stringify(tempNewsData)); 
                setLoading(false); 
            }).catch(() => {
                toast("Your internet is poor")
            })
        }else{
            const tempData = JSON.parse(localStorage.getItem("news") || '[]'); 
            setNewsData([...tempData]); 
            setLoading(false); 
        }

        // eslint-disable-next-line
    }, [])


    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm); 
        setCurrentPage(0); 
    }

    const handleCardClick = (id: string) => {
        navigate(`/news/${id}`); 
    }

    const pageChange = (value: { index: number; selected: number; 
        nextSelectedPage: number; event: object; isPrevious: boolean;
         isNext: boolean; isBreak: boolean; isActive: boolean; }) => {
        
        if(value.nextSelectedPage === undefined || value.nextSelectedPage > pagesCount){
            return; 
        }
 
        setCurrentPage(value.nextSelectedPage)
    }

    const prevClick = () => {
        if(currentPage !== 0){
            setCurrentPage(prevCurrentPage => prevCurrentPage-1); 
        }
    }

    const nextClick = () => {
        if(currentPage !== Math.floor(pagesCount)){
            setCurrentPage(prevCurrentPage => prevCurrentPage+1); 
        }
    }

    return(
        <div className='home'>
            <div className='loginBackground'></div>
            <div className='homeContent'>
                <Nav/>
                <h1>Loged in as {JSON.parse(localStorage.getItem("user") || '').name}</h1>

                <input type="text" placeholder='Search News Title' value={search} onChange={(e) => handleSearch(e.target.value)}/>

                {
                    loading ? <h2>Loading....</h2> :
                    <div className='homeMid'>
                    {
                        displayArray.map((news, index) => (
                            <div className='newsCard' key={news.id} onClick={() => handleCardClick(news.id !== undefined ? news.id : '')}>
                                {/* <div className='newsCardMid'> */}
                                    <h2>{news.title}</h2>
                                    <p className='author'>{news.author !== undefined ? news.author.name : ''}</p>
                                    <hr></hr>
                                    <p className='excerpt'>{news.excerpt}</p>
                                {/* </div> */}
                            </div>
                        ))
                    }


                    <div className='pagination-div'>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="next >"
                            onClick={pageChange}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={pagesCount}
                            previousLabel="< previous"
                            renderOnZeroPageCount={null}
                            activeClassName="activePagination"
                            initialPage={currentPage}
                        />
                    </div>

                    <div className='mob-page-nav'>
                        <p onClick={prevClick}>{'<'}</p>
                        <p>{currentPage+1} of {Math.ceil(pagesCount)}</p>
                        <p onClick={nextClick}>{'>'}</p>
                    </div>


                    </div>
                }
                

                <ToastContainer />
            </div>

           
        </div>
        
    )
}

export default Home; 