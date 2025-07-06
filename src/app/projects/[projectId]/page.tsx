interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectIdPage({ params }: Props) {
  const { projectId } = await params;

  return <div>Project id page {projectId}</div>;
}
