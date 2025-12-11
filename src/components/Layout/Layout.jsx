import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../Contact/WhatsAppButton';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;