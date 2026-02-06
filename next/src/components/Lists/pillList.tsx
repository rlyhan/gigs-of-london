import { PILL_OPTIONS } from "@/config";
import styles from "./list.module.scss";

const PillList = ({ onSelect }: { onSelect: (text: string) => void }) => (
  <ul className={styles.pillList}>
    {PILL_OPTIONS.map((pill) => (
      <li
        key={pill.label}
        className={styles.pill}
        onClick={() => onSelect(pill.label)}
      >
        {pill.label}
      </li>
    ))}
  </ul>
);

export default PillList