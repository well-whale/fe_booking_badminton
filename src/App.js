import React, { useEffect } from 'react';
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
import Payment from './pages/payment/Payment';
import Customer from './pages/list/Customer';
import NewUser from './pages/new/NewUser';
import CourtsActive from './pages/list/CourtsActive';
import UpdateCourt from './pages/update/UpdateCourt';
import SearchAndList from './pages/userCourt/SearchList';
import AdminHome from './pages/adminHomePage/Home';
import ProtectedRoute from './router/ProtectedRoute';
import { routes } from './router/routes';
import Invoice from './pages/bill/BillDate';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/userSlice';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import BookingList from './pages/booked/BookedList';
import BookDay from './pages/book/BookDay';
import BookMonth from './pages/book/BookMonth';
import ListAdmin from './pages/list/Admin';
import CourtOwner from './pages/list/CourtOwner';
import CourtsPause from './pages/list/CourtPause';
import CourtsPending from './pages/list/CourtPending';
import OwnerHome from './pages/ownerHome/Home';
import ListCourtForOwnerActive from './pages/list/ListCourtForOwnerActive';
import ListCourtForOwnerPending from './pages/list/ListCourtForOwnerPending';
import ListCourtForOwnerPause from './pages/list/ListCourtForOwnerPause';
import ListOrder from './pages/list/Order';
import NewCourt from './pages/new/NewCourt';
import ProfileAdmin from './pages/single/Profile';
import ProfileOwner from './pages/single/ProfileOwner';
import PaymentMonthPage from './pages/payment/PaymentMonth';
import CustomizedBreadcrumbs from './components/breadcrumb/Breadcrumb';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
      dispatch(loginSuccess({ user, token }));
    }
  }, [dispatch]);

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
        <Route path={routes.paymentSuccess} element={<><Header /><CustomizedBreadcrumbs /><PaymentSuccess /><Footer /></>} />
        <Route path={routes.booked} element={<><Header /><CustomizedBreadcrumbs page="booked" /><BookingList /><Footer /></>} />
        <Route path={routes.loginOTP} element={<LoginOTP />} />
        <Route path={routes.courtDetail} element={<><Header /><CustomizedBreadcrumbs page="courtDetail" /><CourtDetail /><ListCourt /><Footer /></>} />
        <Route path={routes.search} element={<><Header /><CustomizedBreadcrumbs page="search" /><SearchAndList /><Footer /></>} />
        <Route path={routes.bookingday} element={<><Header /><CustomizedBreadcrumbs page="bookingDay" /><BookDay /><Footer /></>} />
        <Route path={routes.bookingmonth} element={<><Header /><CustomizedBreadcrumbs page="bookingMonth" /><BookMonth /><Footer /></>} />
        <Route path={routes.payment} element={<ProtectedRoute role="Customer"><Header /><CustomizedBreadcrumbs page="paymentDay" /><Payment /><Footer /></ProtectedRoute>} />
        <Route path={routes.paymentMonth} element={<ProtectedRoute role="Customer"><Header /><CustomizedBreadcrumbs page="paymentMonth" /><PaymentMonthPage /><Footer /></ProtectedRoute>} />
        <Route path={routes.bill} element={<><Header /><CustomizedBreadcrumbs page="search" /><Invoice /><Footer /></>} />

        <Route path={routes.adminHome} element={<ProtectedRoute role="Admin"><AdminHome /></ProtectedRoute>} />
        <Route path={routes.adminListUsers} element={<ProtectedRoute role="Admin"><Customer /></ProtectedRoute>} />
        <Route path={routes.adminListAdmins} element={<ProtectedRoute role="Admin"><ListAdmin /></ProtectedRoute>} />
        <Route path={routes.adminListOwners} element={<ProtectedRoute role="Admin"><CourtOwner /></ProtectedRoute>} />
        <Route path={routes.adminCourtActive} element={<ProtectedRoute role="Admin"><CourtsActive /></ProtectedRoute>} />
        <Route path={routes.adminListCourtPending} element={<ProtectedRoute role="Admin"><CourtsPending /></ProtectedRoute>} />
        <Route path={routes.adminListCourtPause} element={<ProtectedRoute role="Admin"><CourtsPause /></ProtectedRoute>} />
        <Route path={routes.adminNewUser} element={<ProtectedRoute role="Admin"><NewUser /></ProtectedRoute>} />
        <Route path={routes.adminProfile} element={<ProtectedRoute role="Admin"><ProfileAdmin /></ProtectedRoute>} />
        <Route path={routes.adminUpdateCourt} element={<ProtectedRoute role="Admin"><UpdateCourt /></ProtectedRoute>} />

        <Route path={routes.ownerHome} element={<ProtectedRoute role="Court Owner"><OwnerHome /></ProtectedRoute>} />
        <Route path={routes.listCourtForOwnerActive} element={<ProtectedRoute role="Court Owner"><ListCourtForOwnerActive /></ProtectedRoute>} />
        <Route path={routes.listCourtForOwnerPending} element={<ProtectedRoute role="Court Owner"><ListCourtForOwnerPending /></ProtectedRoute>} />
        <Route path={routes.listCourtForOwnerPause} element={<ProtectedRoute role="Court Owner"><ListCourtForOwnerPause /></ProtectedRoute>} />
        <Route path={routes.listOrder} element={<ProtectedRoute role="Court Owner"><ListOrder /></ProtectedRoute>} />
        <Route path={routes.newCourt} element={<ProtectedRoute role="Court Owner"><NewCourt /></ProtectedRoute>} />
        <Route path={routes.ownerProfile} element={<ProtectedRoute role="Court Owner"><ProfileOwner /></ProtectedRoute>} />
        <Route path={routes.ownerUpdateCourt} element={<ProtectedRoute role="Court Owner"><UpdateCourt /></ProtectedRoute>} />
      </Routes>
    </React.StrictMode>
  );
}

export default App;
