import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { getSession, redirectToDashboard } from '@/lib/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  console.log(session);

  await redirectToDashboard();
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header session={session} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
