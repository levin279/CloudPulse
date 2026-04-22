import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FAB({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white z-50 transition-colors"
      aria-label="Add Task"
    >
      <Plus size={28} />
    </motion.button>
  );
}
