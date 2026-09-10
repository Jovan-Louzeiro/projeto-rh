type Props = { children: string; tone?: "green" | "yellow" | "blue" | "red" };

export default function Status({ children, tone = "green" }: Props) {
  return <span className={`status ${tone}`}>{children}</span>;
}
