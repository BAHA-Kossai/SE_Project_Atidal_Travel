import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F1F9FE]">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

<<<<<<< HEAD
export default Layout;
=======
export default Layout;
>>>>>>> 2a51f528887ff772e69306095b2b359c7186f795
