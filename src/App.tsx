import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './app.scss';
import Login from './components/login/login';
import Home from './components/home/home';


const Conversations = () => {

  return (
    <>
      <button onClick={() => { localStorage.clear() }}>sign out</button>
    </>
  );
}

export const useToken = () => {
  const [token, setToken] = React.useState<string | null>(localStorage.token || null);
  React.useDebugValue(token);
  
  React.useEffect(() => {
    
    const storageCallback = () => {
      if (localStorage.token !== token) {
        setToken(localStorage.token);
      }
    }
    window.addEventListener('storage', storageCallback);
    
    return () => window.removeEventListener('storage', storageCallback);
    
  }, [token])
  
  return token;
}

function RequireAuth({ children}: { children: JSX.Element }) {
  const token = useToken();
  let location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}


const App = () => {

  return (
    <div className='app'>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route
          path="*"
          element={
          <RequireAuth>
            <Home/>
          </RequireAuth>
          }
        >
        </Route>
      </Routes>

    </div>
  );
}

export default App;