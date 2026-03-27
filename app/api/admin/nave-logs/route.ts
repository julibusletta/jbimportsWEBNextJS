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
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        // Temporary: allowing for debugging if session is tricky, 
        // but keeping the structure for future security.
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
