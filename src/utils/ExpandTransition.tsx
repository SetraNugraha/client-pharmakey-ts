import { motion, AnimatePresence } from "framer-motion";

interface ExpandTransitionProps {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ExpandTransition = ({ isActive, children, className }: ExpandTransitionProps) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isActive ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          exit={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          //   className="mt-[10px] px-5 py-7 bg-white rounded-[24px] flex flex-col gap-y-5 overflow-hidden origin-top"
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
