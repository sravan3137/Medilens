import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '../context/ThemeContext.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Profile from '../pages/Profile.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import  SocketProvider  from '../context/SocketProvider.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import AddConnections from '../components/AddConnections.jsx';
import RequestsAndResponses from '../components/RequestsAndResponses.jsx';
import Chat from '../components/Chat.jsx';
const router = createBrowserRouter([
  {path:"/",element:<ProtectedRoute><App/></ProtectedRoute>},
  {path:"/profile",element:<Profile/>},
  {path:"/login",element:<LoginPage/>},
  {path:"/signup",element:<SignupPage/>},
  {path:"/addConnections",element:<AddConnections/>},
  {path:"/requests",element:<RequestsAndResponses/>},
  {path:"/chat/:targetId/:roomId",element:<Chat/>}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <RouterProvider router={router}></RouterProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
  </StrictMode>,
  
)
