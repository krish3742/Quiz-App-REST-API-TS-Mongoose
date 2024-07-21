import {Routes, Route, Navigate} from 'react-router-dom';
import OuterLayout from './components/layout/OuterLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import ResetPassword from './pages/ResetPassword';
import VerifyRegisteredUser from './pages/VerifyRegisteredUser';
import ActivateAccount from './pages/ActivateAccount';
import ForgotPasword from './components/ForgotPassword';
import MyAccount from './pages/MyAccount';

function App() {
  return (
    <OuterLayout>
      <Routes>
        <Route path='/auth/register' element={<Register />}></Route>
        <Route path='/auth/login' element={<Login />}></Route>
        <Route path='/auth/activateaccount' element={<ActivateAccount />}></Route>
        <Route path='/auth/forgotpassword/:token' element={<ForgotPasword />} ></Route>
        <Route path='/auth/resetpassword' element={<ResetPassword />}></Route>
        <Route path='/auth/verifyaccount' element={<VerifyRegisteredUser />}></Route>
        <Route path='/auth/user/my-account' element={<MyAccount />}></Route>
        <Route path='/auth/quiz' element={<Quiz />}></Route>
        <Route path='*' element={<Navigate to='/auth/register' />}></Route>
      </Routes>
    </OuterLayout>
  );
}

export default App;
