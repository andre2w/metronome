import styles from "./result.module.scss";

export interface ResultProps {
  right: number;
  missed: number;
}

export function Result(result: ResultProps) {
  return (
    <div className={styles.result}>
      <div className={styles["result-cell"]}>
        <span className={styles["result-cell-label"]}>Hit</span>
        <span className={styles["result-cell-value"]} data-tone="hit">
          {result.right}
        </span>
      </div>
      <div className={styles["result-cell"]}>
        <span className={styles["result-cell-label"]}>Missed</span>
        <span className={styles["result-cell-value"]} data-tone="miss">
          {result.missed}
        </span>
      </div>
    </div>
  );
}
