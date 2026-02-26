import { motion } from 'framer-motion';
import { buttonHoverScale, buttonTapScale, buttonTransition } from './PageTransition';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function AnimatedButton({ children, className, ...props }: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: buttonHoverScale }}
      whileTap={{ scale: buttonTapScale }}
      transition={buttonTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
