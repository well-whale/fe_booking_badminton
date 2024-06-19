import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import LoginAndSignupForm from './pages/login/Login';
import LoginOTP from './pages/login/LoginOTP';
import GoogleOAuth from './pages/login/Google_OAuth';
import Header from './components/user/header/Header';
import Footer from './components/user/footer/Footer';
import HomePage from './pages/userHomePage/Home';
import CourtDetail from './pages/userCourt/CourtDetail';
import ListCourt from './pages/userCourt/ListCourt';
import TimeSlots from './pages/time/TimeSlot';
import Payment from './pages/payment/Payment';
import Customer from './pages/customers/Customer';
import NewUser from './pages/new/NewUser';
import Courts from './pages/adminCourts/Courts';
import UpdateCourt from './pages/update/UpdateCourt';
import SearchAndList from './pages/userCourt/SearchList';
import AdminHome from './pages/adminHomePage/Home'
import ProtectedRoute from './router/ProtectedRoute';
import { routes } from './router/routes';

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path={routes.home} element={<><Header /><HomePage /><Footer /></>} />
        <Route path={routes.login} element={<><Header /><LoginAndSignupForm /><Footer /></>} />
        <Route path={routes.googleOAuth} element={
          <GoogleOAuthProvider clientId="21328047732-02qfv7vb9ku5n0ov51v8d3k8vqb7e1ab.apps.googleusercontent.com">
            <GoogleOAuth />
          </GoogleOAuthProvider>
        } />
        <Route path={routes.loginOTP} element={<LoginOTP />} />
        <Route path={routes.courtDetail} element={<><Header /><CourtDetail /><ListCourt /><Footer /></>} />
        <Route path={routes.search} element={<><Header /><SearchAndList /><Footer /></>} />
        <Route path={routes.booking} element={<><Header /><TimeSlots /><Footer /></>} />
        <Route path={routes.payment} element={<><Header /><Payment /><Footer /></>} />
        
        {/* <Route path={routes.adminHome} element={<ProtectedRoute role="ADMIN"><AdminHome /></ProtectedRoute>} />
        <Route path={routes.adminUsers} element={<ProtectedRoute role="ADMIN"><Customer /></ProtectedRoute>} />
        <Route path={routes.adminCourt} element={<ProtectedRoute role="ADMIN"><Courts /></ProtectedRoute>} />
        <Route path={routes.adminNewUser} element={<ProtectedRoute role="ADMIN"><NewUser /></ProtectedRoute>} />
        <Route path={routes.adminUpdateCourt} element={<ProtectedRoute role="ADMIN"><UpdateCourt /></ProtectedRoute>} /> */}
        <Route path={routes.adminHome} element={<AdminHome/>} />
        <Route path={routes.adminUsers} element={<Customer />} />
        <Route path={routes.adminCourt} element={<Courts />} />
        <Route path={routes.adminNewUser} element={<NewUser />} />
        <Route path={routes.adminUpdateCourt} element={<UpdateCourt />} />
      </Routes>
    </React.StrictMode>
  );
}

export default App;
