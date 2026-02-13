"use client";

import { type Easing, motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const easeOut: Easing = [0.16, 1, 0.3, 1];

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
};

const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
};

const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      animate="animate"
      className={className}
      initial="initial"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      animate="animate"
      className={className}
      initial="initial"
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      animate="animate"
      className={className}
      initial="initial"
      variants={fadeInUp}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      animate="animate"
      className={className}
      initial="initial"
      variants={fadeIn}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      animate="animate"
      className={className}
      initial="initial"
      variants={scaleIn}
    >
      {children}
    </motion.div>
  );
}

export function SlideInRight({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      animate="animate"
      className={className}
      initial="initial"
      variants={slideInRight}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      animate="animate"
      className={className}
      initial="initial"
      variants={slideInLeft}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function AnimatedCard({
  children,
  className,
  index = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      animate="animate"
      className={className}
      initial="initial"
      transition={{ delay: index * 0.1 }}
      variants={fadeInUp}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <motion.div
      animate="animate"
      className={className}
      initial="initial"
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

// Hover animation variants for interactive elements
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

export const hoverLift = {
  whileHover: { y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)" },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};
