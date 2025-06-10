import { motion } from 'framer-motion';

const BoostComp = () => {
  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center py-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring' }}
    >
      <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-gray-900">
        Boost your <span className="bg-gradient-to-r from-[#1746a0] to-[#774A67] bg-clip-text text-transparent">Sales</span> with AlphaX
      </h2>
      <img src="/src/images/Sales3-Photoroom.png" alt="Boost Sales" className="w-full max-w-4xl md:max-w-5xl lg:max-w-6xl h-auto rounded-xl shadow-lg mx-auto" />
    </motion.div>
  );
};

export default BoostComp; 