import { PILL_OPTIONS } from "@/config";
import styles from "./list.module.scss";

const PillList = ({ onSelect }: { onSelect: (text: string) => void }) => (
  <div className={styles.pillList}>
    {PILL_OPTIONS.map((pill) => (
      <div
        key={pill.label}
        className={styles.pill}
        onClick={() => onSelect(pill.label)}
      >
        {pill.label}
      </div>
    ))}
  </div>
);

export default PillList