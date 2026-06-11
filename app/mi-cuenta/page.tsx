import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserDashboard from '@/app/components/Profile/UserDashboard';
import { db } from "@/lib/db";

export default async function MiCuentaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const sortedOrders = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Need to parse/stringify to pass to Client Component safely
  const serializedOrders = JSON.parse(JSON.stringify(sortedOrders));

  return (
    <div className="bg-[#f8fafc] w-full min-h-screen">
      <UserDashboard user={session.user} orders={serializedOrders} />
    </div>
  );
}
