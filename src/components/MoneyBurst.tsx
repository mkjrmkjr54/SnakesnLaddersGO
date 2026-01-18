import { motion } from 'framer-motion';
import bill from '../assets/bill.svg';
import coin from '../assets/coin.svg';

const bursts = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  x: (Math.random() - 0.5) * 300,
  delay: Math.random() * 0.4,
  rotate: (Math.random() - 0.5) * 60
}));

export const MoneyBurst = () => (
  <div className="money-burst">
    {bursts.map((burst) => (
      <motion.img
        key={burst.id}
        src={burst.id % 2 === 0 ? bill : coin}
        className="absolute left-1/2 top-1/2 w-20 opacity-80"
        initial={{ opacity: 0, y: 40, x: 0 }}
        animate={{ opacity: 1, y: -180, x: burst.x, rotate: burst.rotate }}
        transition={{ delay: burst.delay, duration: 1.2 }}
      />
    ))}
  </div>
);
