import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <motion.div 
      className={`flex items-center gap-1.5 relative py-2 px-1 ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover="hover"
    >
      <motion.div 
        className="flex items-center font-['Montserrat'] font-bold text-4xl"
        variants={{
          hover: {
            scale: 1.1,
            transition: { duration: 0.3, ease: "easeOut" }
          }
        }}
      >
        <motion.span 
          className="text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Alpha
        </motion.span>
        <motion.span 
          className="text-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          X
        </motion.span>
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-2xl blur-[20px] opacity-0"
        variants={{
          hover: {
            opacity: 0.7,
            scale: 1.3,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          }
        }}
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)'
        }}
      />
    </motion.div>
  );
};

export default Logo; 