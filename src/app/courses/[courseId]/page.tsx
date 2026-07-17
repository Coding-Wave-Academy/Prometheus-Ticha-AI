export default async function CourseDetailPage(props: PageProps<"/courses/[courseId]">) {
  const { courseId } = await props.params;

  return (
    <div>
      <h1>Course: {courseId}</h1>
      {/* TODO: Course overview, modules, enrollment */}
    </div>
  );
}
