/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div id="prog-bar-container" className="w-full">
      {/* Top Text indicator */}
      <div className="flex justify-between items-center mb-2.5 px-1">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#849137] font-bold">
          Quest Progress
        </span>
        <span className="text-xs font-mono uppercase tracking-wider text-[#f9d440] font-semibold bg-[#849137]/15 px-2.5 py-1 rounded border border-[#849137]/30">
          Question {current} of {total}
        </span>
      </div>

      {/* Bar container */}
      <div className="w-full h-2 bg-zinc-900 border border-zinc-800/80 rounded-full overflow-hidden p-[2px]">
        <motion.div
          id="prog-bar-fill shadow-[0_0_8px_rgba(132,145,55,0.4)]"
          className="h-full bg-gradient-to-r from-[#849137] to-[#f9d440] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
