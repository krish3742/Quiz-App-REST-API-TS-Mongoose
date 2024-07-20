import {Routes, Route} from 'react-router-dom';
import OuterLayout from './components/layout/OuterLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import VerifyRegisteredUser from './pages/VerifyRegisteredUser';
import ActivateAccount from './pages/ActivateAccount';

function App() {
  return (
    <OuterLayout>
      <Routes>
        {/* <Route path='/' element={<Home />}></Route> */}
        <Route path='/auth/register' element={<Register />}></Route>
        <Route path='/auth/login' element={<Login />}></Route>
        <Route path='/auth/activateaccount' element={<ActivateAccount />}></Route>
        <Route path='/reset-password' element={<ResetPassword />}></Route>
        <Route path='/auth/verify-account' element={<VerifyRegisteredUser />}></Route>
      </Routes>
    </OuterLayout>
  );
}

export default App;
