export default async function QuizPage(
  props: PageProps<"/courses/[courseId]/quizzes/[quizId]">
) {
  const { courseId, quizId } = await props.params;

  return (
    <div>
      <h1>Quiz: {quizId}</h1>
      <p>Course: {courseId}</p>
      {/* TODO: Quiz questions, timer, submit */}
    </div>
  );
}
