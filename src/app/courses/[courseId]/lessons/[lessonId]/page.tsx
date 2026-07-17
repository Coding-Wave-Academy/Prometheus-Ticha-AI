export default async function LessonPage(
  props: PageProps<"/courses/[courseId]/lessons/[lessonId]">
) {
  const { courseId, lessonId } = await props.params;

  return (
    <div>
      <h1>Lesson: {lessonId}</h1>
      <p>Course: {courseId}</p>
      {/* TODO: Lesson content, video player, navigation */}
    </div>
  );
}
