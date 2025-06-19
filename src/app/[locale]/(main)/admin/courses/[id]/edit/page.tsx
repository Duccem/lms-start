import CourseEditSection from "../../_components/course-edit-section";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <CourseEditSection id={id} />;
};

export default Page;
