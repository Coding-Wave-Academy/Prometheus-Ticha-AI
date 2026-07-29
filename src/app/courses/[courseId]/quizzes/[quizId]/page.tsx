export default async function QuizPage(props: {
  params: Promise<{ courseId: string; quizId: string }>;
}) {
  const { courseId, quizId } = await props.params;

  return (
    <div>
      <h1>Quiz: {quizId}</h1>
      <p>Course: {courseId}</p>
      {/* TODO: Quiz questions, timer, submit */}
    </div>
  );
}
