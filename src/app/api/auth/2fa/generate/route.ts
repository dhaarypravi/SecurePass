import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import connectDB from '@/lib/mongodb';


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Generate a secret key for the user
    const secret = speakeasy.generateSecret({
      name: `Secure Vault (${session.user.email})`,
      issuer: 'Secure Vault',
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCode,
    });
  } catch (error) {
    console.error('2FA generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate 2FA secret' },
      { status: 500 }
    );
  }
}