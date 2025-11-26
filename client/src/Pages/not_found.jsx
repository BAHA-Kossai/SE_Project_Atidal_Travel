import { Link } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

const Not_found = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-block bg-[#117BB8] text-white px-8 py-3 rounded-full hover:bg-[#0f6da4] transition-colors duration-200 font-medium"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Not_found;
