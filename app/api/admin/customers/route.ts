import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    await (db as any).dbConnect();
    const User = await (db as any).getUserModel();
    const Order = await (db as any).getOrderModel();
    
    // Get all users who are not admins (or all users)
    const users = await User.find({ role: { $ne: 'ADMIN' } }).sort({ createdAt: -1 }).lean();
    
    // Enrich with order count
    const enrichedUsers = await Promise.all(users.map(async (user: any) => {
      const orderCount = await Order.countDocuments({ userEmail: user.email.toLowerCase() });
      return {
        ...user,
        orderCount
      };
    }));
    
    return NextResponse.json({ success: true, customers: enrichedUsers });
  } catch (error: any) {
    console.error('API Error [customers]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
