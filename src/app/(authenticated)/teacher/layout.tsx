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
    <div className="w-full min-h-screen flex flex-col">
      <TeacherHeader session={session} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
