import { Routes, Route, Navigate } from 'react-router-dom';

import Quiz from './pages/Quiz';
import Login from './pages/Login';
import MyQuiz from './pages/MyQuiz';
import ViewQuiz from './pages/ViewQuiz';
import Register from './pages/Register';
import MyAccount from './pages/MyAccount';
import ChangeName from './pages/ChangeName';
import CreateQuiz from './pages/CreateQuiz';
import ActivateUser from './pages/ActivateUser';
import PublishQuiz from './pages/PublishQuizPage';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import ActivateAccount from './pages/ActivateAccount';
import VerifyRegisteredUser from './pages/VerifyRegisteredUser';
import VerifyDeactivateOtpPage from './pages/VerifyDeactivateOtpPage';

import ForgotPasword from './components/ForgotPassword';
import OuterLayout from './components/layout/OuterLayout';
import ActivateUserCallback from './components/ActivateUserCallback';
import UpdateQuiz from './pages/UpdateQuiz';
import Reports from './pages/Reports';
import PublishedQuiz from './pages/PublishedQuiz';

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
        <Route path='/auth/quiz/publish' element={<PublishQuiz />}></Route>
        <Route path='/auth/quiz/myquiz' element={<MyQuiz />}></Route>
        <Route path='/auth/quiz/update' element={<UpdateQuiz />}></Route>
        <Route path='/auth/quiz/view' element={<ViewQuiz />}></Route>
        <Route path='/auth/reports' element={<Reports />}></Route>
        <Route path='/auth/published-quiz' element={<PublishedQuiz />}></Route>

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
