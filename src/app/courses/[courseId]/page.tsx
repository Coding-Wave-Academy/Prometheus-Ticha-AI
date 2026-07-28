export default async function CourseDetailPage(props: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await props.params;

  return (
    <div>
      <h1>Course: {courseId}</h1>
      {/* TODO: Course overview, modules, enrollment */}
    </div>
  );
}
