import { motion, AnimatePresence } from "motion/react";
import { X } from "@untitledui/icons";

import { variants } from "@/utils/animation-variants";

import s from "./overlay.module.css";

export function Overlay({ children, state, className = "", title = "", onClose = () => {} }) {
  return (
    <AnimatePresence mode="wait">
      {state === "active" && (
        <motion.div
          key="backdrop"
          className={`${s.backdrop} ${className}`}
          initial="inactive"
          exit="inactive"
          animate={state}
          variants={variants.backdrop}
        >
          <motion.div className={s.gradientBlurContainer}>
            <motion.div className={s.gradientBlur} variants={variants.gradientBlur} />
          </motion.div>

          <motion.div className={s.overlayContainer}>
            <motion.div className={s.overlay} variants={variants.overlay}>
              <motion.div className={s.content} variants={variants.content}>
                <div className={s.titleContainer}>
                  <div className={s.title}>{title}</div>

                  <button className={s.closeBtn} onClick={onClose}>
                    <X className={s.closeBtnIcon} />
                  </button>
                </div>

                {children}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
