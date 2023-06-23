import {BrowserRouter, Route, Routes} from 'react-router-dom'; 
// import Dashboard from './pages/dashboard';
import Login from './pages/Login';
import Home from './pages/Home';
import News from './pages/News';
import SignUp from './pages/SignUp';
// import UserDetails from './pages/userdetails';
// import Users from '../pages/userstemp';
import {} from 'react-router-dom'; 
import AddNews from './pages/AddNews';
 
const Application = () => {
    return (  
        <BrowserRouter> 
            <Routes>
                <Route path = "/" element={<Login/>} />
                <Route path = "/home" element={<Home/>} />
                <Route path = '/add' element={<AddNews/>} />
                {/* <Route path = "/userdetails" element={<UserDetails/>} /> */}
                <Route path ='/signup' element={<SignUp/>}/>
                <Route path = "/news">
                    <Route index element = {<News/>}/>
                    <Route path=":id" element = {<News/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
 
export default Application;