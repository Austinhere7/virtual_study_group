import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/verify-email/status - Check email verification status
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-email/status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to check status' }, { status: 500 })
  }
}
