import Link from 'next/link';
import CourseForm from '@/components/admin/CourseForm';

export default function NewCoursePage() {
  return (
    <div className="admin-page admin-narrow">
      <div className="admin-crumb"><Link href="/school/admin">Courses</Link> / New</div>
      <h1>New course</h1>
      <CourseForm />
    </div>
  );
}
