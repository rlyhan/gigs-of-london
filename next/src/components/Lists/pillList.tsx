import { PILL_OPTIONS } from "@/config";
import styles from "./list.module.scss";

const PillList = ({ onSelect }: { onSelect: (text: string) => void }) => (
  <ul className={styles.pillList}>
    {PILL_OPTIONS.map((pill, index) => {
      const isLast = index === PILL_OPTIONS.length - 1;
      return (
        <li
          key={pill.label}
          className={`${styles.pill}${isLast ? ` ${styles.pillWide}` : ""}`}
          onClick={() => onSelect(pill.label)}
        >
          <span className={styles.pill__emoji} aria-hidden="true">
            {pill.emoji}
          </span>
          <span className={styles.pill__label}>{pill.label}</span>
        </li>
      );
    })}
  </ul>
);

export default PillList
