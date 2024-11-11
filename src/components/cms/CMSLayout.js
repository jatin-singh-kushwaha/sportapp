import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CMSLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Logout and reset user state
      navigate('/admin/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed: ', error);
    }
  };

  return (
    <div className="flex">
      <aside className="w-64 bg-black text-white h-screen p-5 fixed"> {/* Fixed sidebar */}
        <h2 className="text-2xl mb-6">CMS Dashboard</h2>
        <ul>
          <li className="mb-4">
            <Link to="/admin/dashboard" className="hover:text-gray-400">Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/manage-sports" className="hover:text-gray-400">Manage Sports</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/manage-channels" className="hover:text-gray-400">Manage Channels</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/manage-users" className="hover:text-gray-400">Manage Users</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="w-full text-left hover:text-gray-400">
              Logout
            </button>
          </li>
        </ul>
      </aside>
      <div className="ml-64 flex-grow p-5 h-screen overflow-auto"> {/* Main content */}
        <Outlet />
      </div>
    </div>
  );
};

export default CMSLayout;
