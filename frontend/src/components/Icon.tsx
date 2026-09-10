type Props = {
  name: string;
  className?: string;
};

export default function Icon({ name, className = "" }: Props) {
  return <i aria-hidden="true" className={`fi fi-rr-${name} ${className}`} />;
}
