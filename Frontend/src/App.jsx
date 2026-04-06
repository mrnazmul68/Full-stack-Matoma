import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Donor from './components/Donor';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import DonorsResults from './pages/DonorsResults';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfileCompletionGuard from './components/ProfileCompletionGuard';

function MainLayout() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let current = 'home';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        current = sections[sections.length - 1].getAttribute('id');
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App min-h-screen overflow-x-hidden bg-black px-4 sm:px-5 md:px-8 xl:px-[50px]">
      <Header activeSection={activeSection} />
      <Home />
      <Donor />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={(
            <ProfileCompletionGuard>
              <MainLayout />
            </ProfileCompletionGuard>
          )}
        />
        <Route
          path="/signup"
          element={(
            <ProfileCompletionGuard>
              <SignIn />
            </ProfileCompletionGuard>
          )}
        />
        <Route
          path="/login"
          element={(
            <ProfileCompletionGuard>
              <Login />
            </ProfileCompletionGuard>
          )}
        />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route
          path="/donors"
          element={(
            <ProfileCompletionGuard>
              <DonorsResults />
            </ProfileCompletionGuard>
          )}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
