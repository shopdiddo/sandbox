"use client";

import { useMemo, useCallback, Fragment } from "react";
import { motion } from "motion/react";

import { useProductOptions } from "@/providers/product-options";

import s from "./option-selector.module.css";

export function OptionSelectors({ selectorSize = "unset" }) {
  const optionNames = useProductOptions((s) => s.optionNames);
  const optionValues = useProductOptions((s) => s.optionValues);
  const selectedOptionIdxs = useProductOptions((s) => s.selectedOptionIdxs);
  const setSelectedOptionIdx = useProductOptions((s) => s.setSelectedOptionIdx);

  return optionNames.map((name, nameIdx) => (
    <Fragment key={`option-name-${nameIdx}`}>
      <div className={s.optionLabel}>{name}</div>
      <div className={s.options} style={{ "--selector-size": selectorSize }}>
        {optionValues[name].map(({ value }, valIdx) => (
          <motion.div
            key={`option-val-${nameIdx}-${valIdx}`}
            onClick={() => {
              setSelectedOptionIdx(nameIdx, valIdx);
            }}
            className={`${s.option} ${selectedOptionIdxs[nameIdx] === valIdx ? s.selected : ""}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: valIdx * 0.03,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            {value}
          </motion.div>
        ))}
      </div>
    </Fragment>
  ));
}
