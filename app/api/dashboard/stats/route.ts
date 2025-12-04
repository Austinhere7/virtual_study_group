import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/dashboard/stats - Get user statistics
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch stats' }, { status: 500 })
  }
}
