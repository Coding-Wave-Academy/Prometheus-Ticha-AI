export default async function LessonPage(props: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await props.params;

  return (
    <div>
      <h1>Lesson: {lessonId}</h1>
      <p>Course: {courseId}</p>
      {/* TODO: Lesson content, video player, navigation */}
    </div>
  );
}
