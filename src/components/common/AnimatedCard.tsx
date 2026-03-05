import { motion } from 'framer-motion';
import { cardHoverY, cardTransition } from './PageTransition';
import { HTMLAttributes, ReactNode } from 'react';

interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function AnimatedCard({ children, className, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ y: cardHoverY }}
      transition={cardTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
