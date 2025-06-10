import { motion } from 'framer-motion';

const CTABanner = () => {
  return (
    <motion.div
      className="relative z-10 flex justify-center animate-fadein"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring' }}
    >
      <div className="rounded-2xl bg-gradient-to-tr from-[#1746a0] via-[#774A67] to-[#8b5cf6] shadow-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-8 backdrop-blur-xl">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 drop-shadow-lg">Customized for more than 50 industries</h3>
          <p className="text-white/90 font-medium text-lg mb-2">Further customizations available per request.<br />Find out how AlphaX helps you develop and manage your business.</p>
        </div>
        <motion.a
          href="/signup"
          className="inline-block px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 relative overflow-hidden"
          whileHover={{ scale: 1.07, boxShadow: '0 0 32px 8px #40B93C' }}
        >
          <span className="relative z-10">GET STARTED FOR FREE</span>
          {/* Glowing effect */}
          <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-400 via-green-500 to-green-600 opacity-30 blur-lg animate-pulse" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default CTABanner; 