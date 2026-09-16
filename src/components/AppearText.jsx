import { motion, useReducedMotion } from 'framer-motion';

export default function AppearText({ text, className = '' }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');
  return <motion.span className={`appear-text ${className}`} initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.09 } } }}>
    {words.map((word, index) => <motion.span key={`${word}-${index}`} className="appear-word" variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 26, filter: reduceMotion ? 'none' : 'blur(7px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reduceMotion ? 0 : 0.58, ease: [0.16, 1, 0.3, 1] } } }}>{word}{index < words.length - 1 ? ' ' : ''}</motion.span>)}
  </motion.span>;
}
