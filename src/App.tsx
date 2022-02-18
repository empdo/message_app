import React from 'react';
import { Navigate, Route, Routes, useLocation} from 'react-router-dom';
import contentManager from './contentmanager';
import './app.scss';
import Login from './components/login/login';
import Home from './components/home/home';
import Signup from './components/signup/Signup';

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

  React.useEffect(() => {
    contentManager.getConversations()
  }, [token]);

  if (!token && location.pathname !== "/signup") {
    return <Navigate to={location.pathname !== "/signup" ? "/login" : "/signup"} state={{ from: location }} replace />;
  }

  return children;
}


const App = () => {

  return (
    <div className='app'>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/conversation/:id' 
          element={
          <RequireAuth>
            <Home/>
          </RequireAuth>
          }
 />
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