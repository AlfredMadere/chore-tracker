"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Chore = {
  id: number;
  name: string;
  points: number;
  description?: string;
  freeform?: boolean;
  groupId: number;
};

type ChoreLogCardProps = {
  chore: Chore;
  isLogging: boolean;
  onClick: () => void;
};

export default function ChoreLogCard({ chore, isLogging, onClick }: ChoreLogCardProps) {
  // For freeform chores, remove the UUID suffix from display
  const displayName = chore.freeform ? chore.name.split('__')[0] : chore.name;

  // Animation variants
  const cardVariants = {
    initial: { 
      scale: 1,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      backgroundColor: "rgb(255, 255, 255)"
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)"
    },
    tap: { 
      scale: 0.98 
    },
    logging: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const checkVariants = {
    initial: { 
      opacity: 0,
      scale: 0,
      rotate: -45
    },
    animate: { 
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const pointsVariants = {
    initial: { 
      opacity: 1,
      scale: 1,
      y: 0
    },
    exit: { 
      opacity: 0,
      scale: 0.5,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate={isLogging ? "logging" : "initial"}
      variants={cardVariants}
      onClick={onClick}
      className="bg-card p-3 flex flex-col justify-between h-24 cursor-pointer rounded-lg shadow-sm overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm line-clamp-2">{displayName}</h3>
        
        {isLogging ? (
          <motion.div
            variants={checkVariants}
            initial="initial"
            animate="animate"
            className="flex-shrink-0"
          >
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </motion.div>
        ) : (
          <motion.span
            variants={pointsVariants}
            className="text-xs font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex-shrink-0"
          >
            +{chore.points} mins
          </motion.span>
        )}
      </div>
      
      {chore.freeform && (
        <span className="text-[10px] text-muted-foreground self-start mt-auto">
          Freeform
        </span>
      )}
    </motion.div>
  );
}
