import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
