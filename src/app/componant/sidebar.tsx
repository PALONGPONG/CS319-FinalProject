'use client';

import { faBuilding, faHouse, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

export default function SidebarLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ซ่อน Loading screen หลังจากโหลดเสร็จ
    if (loadingRef.current) {
      loadingRef.current.classList.add('hidden');
    }
  }, []);

  return (
    <div className="flex h-screen antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
      {/* Loading screen */}
      <div
        ref={loadingRef}
        className="fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold text-white bg-blue-600"
      >
        Loading.....
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-10 flex w-80 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Curvy shape */}
        <svg
          className="absolute inset-0 w-full h-full text-white"
          style={{ filter: 'drop-shadow(10px 0 10px #B18E8E30)' }}
          preserveAspectRatio="none"
          viewBox="0 0 309 800"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M268.487 0H0V800H247.32C207.957 725 207.975 492.294 268.487 367.647C329 243 314.906 53.4314 268.487 0Z" />
        </svg>

        {/* Sidebar content */}
        <div className="z-10 flex flex-col flex-1">
          <div className="flex items-center justify-between flex-shrink-0 w-64 p-4">
            {/* Logo */}
            <button onClick={() => setSidebarOpen(false)}>
              <span className="sr-only">Stock</span>
              <h1 className='text-3xl font-bold text-blue-500'>Stock</h1>
            
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg focus:outline-none focus:ring"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex flex-col flex-1 w-64 p-4 mt-4 space-y-10">
            <a href="/" className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faHouse} />
              <span>Home</span>
            </a>
            <a href="/typemanage" className='flex items-center space-x-2'>
            <FontAwesomeIcon icon={faTags} />
                <span>Type</span>
            </a>
            <a href="/distributormanage" className='flex items-center space-x-2'>
            <FontAwesomeIcon icon={faBuilding} />
            <span>Distributor</span>
            </a>
            <a href="/order-product" className='flex items-center space-x-2'>
            <FontAwesomeIcon icon={faBuilding} />
            <span>Order History</span>
            </a>
          </nav>
          

          {/* Logout Button */}
          <div className="flex-shrink-0 p-4">
            <button className="flex items-center space-x-2" onClick={()=>Swal.fire(
              'Logout',
              'มีไว้เฉยๆให้มันดูลงตัวขอบคุณครับ',
              'success'
            )}>
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={isSidebarOpen ? `flex flex-col items-center justify-center flex-1`:`flex flex-col items-center justify-center flex-1 z-10`}>
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed p-10 ml-5 text-white bg-blue-500 rounded-full -top-10 -left-16 hover:bg-blue-200 opacity-80"
        >
          <svg
            className="w-6 h-6 ml-4 mt-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="sr-only">Open menu</span>
        </button>
        <h1 className="sr-only">Home</h1>
      </main>
    </div>
  );
}
