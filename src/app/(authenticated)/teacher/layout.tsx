import { Footer } from '@/components/footer';
import TeacherHeader from '@/components/header/TeacherHeader';
import { mustBeTeacher } from '@/lib/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await mustBeTeacher();
  return (
    <div className={`w-full h-full`}>
      <TeacherHeader session={session} />
      {children}
      <Footer />
    </div>
  );
}
