import { Routes, Route } from 'react-router-dom';
import UserSelector from './pages/UserSelector';
import Notifications from './pages/Notifications';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UserSelector />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}