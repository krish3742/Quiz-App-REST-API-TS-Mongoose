import {Routes, Route} from 'react-router-dom';
import OuterLayout from './components/layout/OuterLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import VerifyRegisteredUser from './pages/VerifyRegisteredUser';

function App() {
  return (
    <OuterLayout>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/reset-password' element={<ResetPassword />}></Route>
        <Route path='/verify-account' element={<VerifyRegisteredUser />}></Route>
      </Routes>
    </OuterLayout>
  );
}

export default App;
