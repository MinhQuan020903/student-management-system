import GradingTable from "./GradingTable";

export default function AssignmentDetail({
  params: { assignmentId },
}: {
  params: { assignmentId: string };
}) {
  return (
    <div>
      <GradingTable assignmentId={assignmentId} />
    </div>
  );
}
