"use client"

import { motion } from "framer-motion"
import { Mic, MicOff } from "lucide-react"

interface VoiceButtonProps {
  isListening: boolean
  onClick: () => void
}

export function VoiceButton({ isListening, onClick }: VoiceButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative group"
    >
      {/* Outer Pulse Ring (when listening) */}
      {isListening && (
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-cyan-400"
        />
      )}

      {/* Main Button */}
      <div className={`
        relative z-10 p-4 rounded-full backdrop-blur-xl border-2 transition-all duration-300
        ${isListening 
          ? 'bg-cyan-500/90 border-cyan-300 shadow-lg shadow-cyan-500/50' 
          : 'bg-white/10 border-white/30 hover:border-cyan-400/50 hover:bg-white/20'
        }
      `}>
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Mic className="w-6 h-6 text-white" />
          </motion.div>
        ) : (
          <MicOff className="w-6 h-6 text-white group-hover:text-cyan-300 transition-colors" />
        )}
      </div>

      {/* Listening Indicator Text */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="flex items-center gap-2 text-cyan-300 text-sm font-medium">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ●
            </motion.span>
            Listening...
          </div>
        </motion.div>
      )}

      {/* Hover Tooltip */}
      {!isListening && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="px-3 py-1 bg-black/80 rounded-lg text-white text-xs">
            Click to use voice search
          </div>
        </div>
      )}
    </motion.button>
  )
}