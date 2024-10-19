import React, { Suspense, lazy, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './App/components/PrivateRoute';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'; // Tạo hiệu ứng CSS cho CSSTransition
import { Loader } from 'rsuite';
import { Bounce, ToastContainer } from 'react-toastify'; // Thêm ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS cho react-toastify

// Lazy load components
const Login = lazy(() => import('./App/components/Login/Login'));
const Main = lazy(() => import('./App/components/Main/Main'));

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

function App() {
  const location = useLocation();
  const nodeRef = useRef(null); // Tạo ref cho Transition

  return (
    <TransitionGroup>
      <CSSTransition
        nodeRef={nodeRef} // Sử dụng nodeRef
        key={location.key}
        timeout={300}
        classNames="fade"
      >
        <Suspense fallback={<Loader center content="Loading..." vertical />}>
          <div ref={nodeRef}> {/* Áp dụng ref vào div */}
            <Routes>
              <Route path="/" element={isAuthenticated() ? <Main /> : <Login />} />                            
              <Route path="/login" element={!isAuthenticated() ? <Login /> : <Main />} />
              <Route path="/main" element={
                <PrivateRoute>
                  <Main />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={<h2>Chào mừng đến trang chính</h2>} />
            </Routes>
          </div>
        </Suspense>
      </CSSTransition>
    </TransitionGroup>
  );
}

// Bọc App trong Router
export default function WrappedApp() {
  return (
    <Router>
      <App />
      {/* Đặt ToastContainer ở đây để đảm bảo hoạt động trên toàn ứng dụng */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Router>
  );
}
