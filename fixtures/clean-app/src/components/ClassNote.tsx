type Props = { author: string; body: string };

export function ClassNote({ author, body }: Props) {
  return (
    <div className="note">
      <strong>{author}</strong>
      <p>{body}</p>
    </div>
  );
}
