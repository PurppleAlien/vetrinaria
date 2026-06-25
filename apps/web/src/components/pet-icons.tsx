'use client';

import { motion } from 'framer-motion';

interface PetIconProps {
  className?: string;
  size?: number;
}

export function DogIcon({ className, size = 48 }: PetIconProps) {
  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <ellipse cx="50" cy="65" rx="28" ry="22" className="fill-primary/20" />
      <ellipse cx="50" cy="30" rx="18" ry="16" className="fill-primary/30" />
      <ellipse cx="38" cy="22" rx="8" ry="6" className="fill-primary/40" />
      <ellipse cx="62" cy="22" rx="8" ry="6" className="fill-primary/40" />
      <circle cx="42" cy="28" r="3" className="fill-background" />
      <circle cx="58" cy="28" r="3" className="fill-background" />
      <circle cx="43" cy="27" r="1.5" className="fill-foreground" />
      <circle cx="59" cy="27" r="1.5" className="fill-foreground" />
      <ellipse cx="50" cy="34" rx="4" ry="2.5" className="fill-foreground/20" />
      <path d="M45 37 Q50 42 55 37" className="stroke-foreground/30" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="60" rx="6" ry="3" className="fill-primary/30" transform="rotate(-15 32 60)" />
      <ellipse cx="68" cy="60" rx="6" ry="3" className="fill-primary/30" transform="rotate(15 68 60)" />
      <ellipse cx="35" cy="78" rx="5" ry="7" className="fill-primary/40" />
      <ellipse cx="65" cy="78" rx="5" ry="7" className="fill-primary/40" />
      <path d="M30 35 L25 20 Q27 15 30 18 L35 30" className="fill-primary/30" />
      <path d="M70 35 L75 20 Q73 15 70 18 L65 30" className="fill-primary/30" />
      <motion.path
        d="M46 30 Q50 26 54 30"
        className="stroke-primary/50"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        animate={{ d: ["M46 30 Q50 26 54 30", "M46 29 Q50 25 54 29", "M46 30 Q50 26 54 30"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

export function CatIcon({ className, size = 48 }: PetIconProps) {
  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <ellipse cx="50" cy="62" rx="26" ry="20" className="fill-primary/20" />
      <ellipse cx="50" cy="32" rx="20" ry="16" className="fill-primary/30" />
      <circle cx="42" cy="30" r="3" className="fill-background" />
      <circle cx="58" cy="30" r="3" className="fill-background" />
      <circle cx="43" cy="29" r="1.8" className="fill-foreground" />
      <circle cx="59" cy="29" r="1.8" className="fill-foreground" />
      <ellipse cx="50" cy="37" rx="3" ry="2" className="fill-foreground/20" />
      <path d="M46 39 Q50 43 54 39" className="stroke-foreground/30" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M38 18 L32 10 L30 18 L34 22" className="fill-primary/30" stroke="none" />
      <path d="M62 18 L68 10 L70 18 L66 22" className="fill-primary/30" stroke="none" />
      <path d="M35 20 Q32 15 30 18" className="stroke-primary/40" strokeWidth="1.5" fill="none" />
      <path d="M65 20 Q68 15 70 18" className="stroke-primary/40" strokeWidth="1.5" fill="none" />
      <ellipse cx="34" cy="58" rx="5" ry="8" className="fill-primary/40" />
      <ellipse cx="66" cy="58" rx="5" ry="8" className="fill-primary/40" />
      <path d="M40 75 Q50 85 60 75" className="stroke-primary/30" strokeWidth="2" fill="none" strokeLinecap="round" />
      <motion.circle
        cx="44"
        cy="28"
        r="1"
        className="fill-primary"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="56"
        cy="28"
        r="1"
        className="fill-primary"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

export function PawPrintIcon({ className, size = 24 }: PetIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z" className="fill-primary/60" />
      <path d="M17 11C18.1046 11 19 10.1046 19 9C19 7.89543 18.1046 7 17 7C15.8954 7 15 7.89543 15 9C15 10.1046 15.8954 11 17 11Z" className="fill-primary/60" />
      <path d="M5 15C6.10457 15 7 14.1046 7 13C7 11.8954 6.10457 11 5 11C3.89543 11 3 11.8954 3 13C3 14.1046 3.89543 15 5 15Z" className="fill-primary/40" />
      <path d="M19 15C20.1046 15 21 14.1046 21 13C21 11.8954 20.1046 11 19 11C17.8954 11 17 11.8954 17 13C17 14.1046 17.8954 15 19 15Z" className="fill-primary/40" />
      <ellipse cx="12" cy="17" rx="7" ry="5" className="fill-primary/50" />
    </svg>
  );
}

export function BoneIcon({ className, size = 24 }: PetIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" className="fill-primary/50" />
      <rect x="8" y="5" width="8" height="4" rx="1" className="fill-primary/40" />
      <path d="M12 9C13.1 9 14 9.9 14 11C14 12.1 13.1 13 12 13C10.9 13 10 12.1 10 11C10 9.9 10.9 9 12 9Z" className="fill-primary/50" />
      <rect x="8" y="12" width="8" height="4" rx="1" className="fill-primary/40" />
      <path d="M12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18C10 16.9 10.9 16 12 16Z" className="fill-primary/50" />
      <circle cx="12" cy="4" r="1.5" className="fill-primary/70" />
      <circle cx="12" cy="11" r="1.5" className="fill-primary/70" />
      <circle cx="12" cy="18" r="1.5" className="fill-primary/70" />
    </svg>
  );
}
