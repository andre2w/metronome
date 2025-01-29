export interface ResultProps {
  right: number; 
  missed: number;
};

export function Result(result: ResultProps) {
  return <div style={{ display: "flex", alignItems: "center"}}>
      <h4>Right: {result.right}</h4>
      <h4>Missed: {result.missed}</h4>
    </div>
}