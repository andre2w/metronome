import "./result.css";

export interface ResultProps {
  right: number;
  missed: number;
}

export function Result(result: ResultProps) {
  return (
    <div className="result">
      <div className="result-cell">
        <span className="result-cell-label">Hit</span>
        <span className="result-cell-value" data-tone="hit">
          {result.right}
        </span>
      </div>
      <div className="result-cell">
        <span className="result-cell-label">Missed</span>
        <span className="result-cell-value" data-tone="miss">
          {result.missed}
        </span>
      </div>
    </div>
  );
}
