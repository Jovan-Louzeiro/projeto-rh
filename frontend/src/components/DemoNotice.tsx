export default function DemoNotice({ message }: { message: string }) {
  if (!message) return null;

  return (
    <p className="demo-notice" role="status">
      {message}
    </p>
  );
}
