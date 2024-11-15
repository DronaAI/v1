import { getCourseData } from "@/app/actions/course-actions";
import { CoursePage } from "./course-page";

export default async function CoursePageWrapper({
  params: { slug },
}: {
  params: { slug: string[] };
}) {
  const [courseId, unitIndexParam, chapterIndexParam] = slug;
  const unitIndex = parseInt(unitIndexParam);
  const chapterIndex = parseInt(chapterIndexParam);

  const { course, unit, chapter } = await getCourseData(courseId, unitIndex, chapterIndex);

  return <CoursePage course={course} unit={unit} chapter={chapter} />;
}