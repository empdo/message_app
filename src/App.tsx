import './app.scss';
import React from 'react';
import {Link, Route, BrowserRouter, Routes, useNavigate} from 'react-router-dom';
import Login from './components/login/login';


const Conversations = () => {

  return (
    <>
    <button onClick={() => {localStorage.clear()}}>sign out</button>
    </>
  );
}

const Home = () => {
  return (
    <></>
  )
}


const App = () => {

  let navigate = useNavigate();

  if(!(localStorage.token)){
    
  }

  return (

    <BrowserRouter>
    <div className='app'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>} />
      </Routes>

    </div>
    </BrowserRouter>
  );
}

export default App;