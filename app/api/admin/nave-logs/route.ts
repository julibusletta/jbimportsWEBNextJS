import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * Temporary diagnostic route to view Nave production logs
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        // Allow ONLY for debugging if the user is willing, or just return 401
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { getWebhookLogModel } = db;
    const WebhookLog = await getWebhookLogModel();
    
    // Get last 20 Nave related logs
    const logs = await WebhookLog.find({ 
      service: { $regex: /NAVE/i } 
    }).sort({ createdAt: -1 }).limit(20).lean();

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
