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
import ChangeName from './pages/ChangeName';
import ChangePassword from './pages/ChangePassword';
import VerifyDeactivateOtpPage from './pages/VerifyDeactivateOtpPage';
import ActivateUserCallback from './components/ActivateUserCallback';
import ActivateUser from './pages/ActivateUser';
import CreateQuiz from './pages/CreateQuiz';

function App() {
  return (
    <OuterLayout>
      <Routes>
        <Route path='/auth/register' element={<Register />}></Route>
        <Route path='/auth/verifyaccount' element={<VerifyRegisteredUser />}></Route>

        <Route path='/auth/login' element={<Login />}></Route>
        <Route path='/auth/forgotpassword/:token' element={<ForgotPasword />} ></Route>
        <Route path='/auth/activateaccount' element={<ActivateAccount />}></Route>
        <Route path='/auth/resetpassword' element={<ResetPassword />}></Route>

        <Route path='/auth/quiz' element={<Quiz />}></Route>
        <Route path='/auth/quiz/create' element={<CreateQuiz />}></Route>

        <Route path='/auth/user/my-account' element={<MyAccount />}></Route>
        <Route path='/auth/user/change-name' element={<ChangeName />}></Route>
        <Route path='/auth/user/change-password' element={<ChangePassword />}></Route>
        <Route path='/auth/user/deactivateaccount' element={<VerifyDeactivateOtpPage />}></Route>
        <Route path='/auth/activateuser' element={<ActivateUser />}></Route>
        <Route path='/auth/activate/:token' element={<ActivateUserCallback />}></Route>
        
        <Route path='*' element={<Navigate to='/auth/register' />}></Route>
      </Routes>
    </OuterLayout>
  );
}

export default App;
