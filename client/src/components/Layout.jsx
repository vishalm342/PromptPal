import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
