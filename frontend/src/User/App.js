import React, { useEffect, useContext } from 'react'
import Signin from './Page/signIn/signIn'
import SignUpCustomer from './Page/signUp/signUpCustomer'
import SignUpShipper from './Page/signUp/signUpShipper'
import SignUpOwner from './Page/signUp/signUpOwner'
import SignUpStore from './Page/signUp/signUpStore'
import Header from './Components/header/header'
import ForgotPass from './Page/resetPass/forgotPass'
import ResetPass from './Page/resetPass/resetPass'
import Verify from './Page/resetPass/verify'
import Footer from './Components/footer/footer'
import Profile from './Page/customer/profile'
import UpdateAddress from './Page/customer/updateAddress'
import OrderHistory from './Page/customer/orderHistory'
import Home from './Page/customer/home'
import OrderPage from './Page/customer/orderPage'
import StoreDetail from './Page/customer/storeDetail'
import ViewComment from './Page/customer/viewComment'
// import ProductDetail from './Page/customer/productDetail'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './services/authContext'
import { CityProvider } from './services/CityContext'
import { LanguageProvider } from './services/languageContext'
import { Navigate } from 'react-router-dom'
import Policy from './Page/customer/policy'
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token")
  if (token) {
    return element;
  } else {
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return <Navigate to="/signin" />;
  }
};

const App = () => {
  const checkAndCreateCart = () => {
    // Kiểm tra xem có biến 'cart' trong localStorage hay không
    const existingCart = localStorage.getItem('cart');

    if (!existingCart) {
      const defaultCart = {
        nameStore: '', 
        idStore: '',   
        products: []
      };
      localStorage.setItem('cart', JSON.stringify(defaultCart));
    }
  }

  useEffect(() => {
    checkAndCreateCart();
  },);
  return (

    <LanguageProvider>
      <AuthProvider>
        <CityProvider>
          <AuthContextProvider>
            <ChatContextProvider>
              {/* <Router> */}
              <div className='wrapper'>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signUpCustomer" element={<SignUpCustomer />} />
                  <Route path="/signUpShipper" element={<SignUpShipper />} />
                  <Route path="/signUpOwner" element={<SignUpOwner />} />
                  <Route path="/signUpStore" element={<SignUpStore />} />
                  <Route path="/forgotPass" element={<ForgotPass />} />
                  <Route path="/verify" element={<Verify />} />
                  <Route path="/resetPass" element={<ResetPass />} />
                  <Route path="/policy" element={<Policy />} />
                  <Route path="/home/storeDetail" element={<StoreDetail />} />
                  <Route path="/home/storeComment" element={<ViewComment />} />
                  <Route path="/user/profile" element={<ProtectedRoute element={<Profile />} />} />
                  <Route path="/user/orderHistory" element={<ProtectedRoute element={<OrderHistory />} />} />
                  <Route path="/user/updateAddress" element={<ProtectedRoute element={<UpdateAddress />} />} />
                  <Route path="/user/order" element={<ProtectedRoute element={<OrderPage />} />} />
                </Routes>
                {/* <Footer /> */}
              </div>
              {/* </Router> */}
              <div className="chat-container">
              </div>
            </ChatContextProvider>
          </AuthContextProvider>
        </CityProvider>
      </AuthProvider>
    </LanguageProvider>

  );

}

export default App