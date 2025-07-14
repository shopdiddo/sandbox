export const variants = {
  backdrop: {
    inactive: {
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1,
        duration: 0.3,
      },
    },
    active: {
      transition: {
        staggerChildren: 0.1,
        duration: 0.4,
      },
    },
  },

  gradientBlurContainer: {
    //
  },

  gradientBlur: {
    inactive: {
      maxWidth: "0%",
      backdropFilter: "blur(20px) brightness(1)",
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.4,
      },
    },
    active: {
      backdropFilter: "blur(20px) brightness(0.4)",
      maxWidth: "100%",
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.6,
      },
    },
  },

  overlayContainer: {
    //
  },

  overlay: {
    inactive: {
      x: "100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.3,
      },
    },
    active: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      },
    },
  },

  content: {
    inactive: {
      filter: "blur(8px)",
      opacity: 0,
      y: 20,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.2,
      },
    },
    active: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.4,
        delay: 0.1,
      },
    },
  },

  item: {
    inactive: {
      opacity: 0,
      x: 20,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.2,
      },
    },
    active: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.3,
      },
    },
  },

  stagger: {
    active: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
};
