import { Outlet } from 'react-router';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Animated background - consistent across dashboard */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <motion.div
          animate={{ x: [0, 120, 0], y: [0, -120, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -top-48 -left-48 w-[550px] h-[550px] bg-cyan-500/18 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ x: [0, -110, 0], y: [0, 150, 0], scale: [1, 1.35, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-15%] right-[-20%] w-[650px] h-[650px] bg-violet-500/12 rounded-full blur-[170px]"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={handleToggleMobileMenu}
          onCloseMobileMenu={handleCloseMobileMenu}
        />

        <div className="flex flex-1">
          <Sidebar isMobileOpen={isMobileMenuOpen} onClose={handleCloseMobileMenu} />

          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 lg:ml-64 mt-16 min-h-[calc(100vh-4rem)]  lg:pl-8 overflow-x-hidden"
          >
            <div className=" mx-auto mt-5">
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;