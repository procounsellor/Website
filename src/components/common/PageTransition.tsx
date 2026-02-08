import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  transitionKey: string;
}

// Page/Route transitions - Fast and subtle
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -8,
  },
};

export const pageTransition = {
  duration: 0.2,
  ease: "easeOut",
};

// Tab/Content switch animations - Very fast cross-fade
export const tabTransitionVariants = {
  initial: {
    opacity: 0,
    y: 4,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -4,
  },
};

export const tabTransition = {
  duration: 0.15,
  ease: "easeOut",
};

// Modal animations - Scale + fade
export const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
  },
};

export const modalTransition = {
  duration: 0.2,
  ease: "easeOut",
};

// Backdrop fade
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const backdropTransition = {
  duration: 0.15,
};

// Micro-interactions - Button hover/tap
export const buttonHoverScale = 1.03;
export const buttonTapScale = 0.97;
export const buttonTransition = { duration: 0.08 };

// Card hover
export const cardHoverY = -4;
export const cardTransition = { duration: 0.12 };

// Helper components for common patterns
export function TabTransition({ children, transitionKey }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={tabTransitionVariants}
        transition={tabTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function Modal({ 
  children, 
  isOpen, 
  onClose 
}: { 
  children: ReactNode; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={backdropTransition}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={modalTransition}
          >
            <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function PageTransition({ children, transitionKey }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransitionVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
