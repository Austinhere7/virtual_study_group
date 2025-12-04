import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/verify-email/send - Send verification email
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-email/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send verification email' }, { status: 500 })
  }
}
