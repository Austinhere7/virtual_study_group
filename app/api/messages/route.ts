import { NextRequest, NextResponse } from 'next/server'

/**
 * Messages API Routes
 */

/**
 * GET /api/messages - Get conversations
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { searchParams } = new URL(request.url)
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/messages?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch messages' }, { status: 500 })
  }
}

/**
 * POST /api/messages - Send a message
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const body = await request.json()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 })
  }
}
