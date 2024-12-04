import AdminHeader from '@/components/header/AdminHeader';
import { mustBeAdmin } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await mustBeAdmin();

  return (
    <div className={`w-full h-full`}>
      <AdminHeader session={session} />
      {children}
    </div>
  );
}
