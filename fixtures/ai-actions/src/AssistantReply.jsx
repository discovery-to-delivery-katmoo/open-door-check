export function AssistantReply({ answer }) {
  return <div className="reply" dangerouslySetInnerHTML={{ __html: answer }} />;
}
