import { NextRequest, NextResponse } from 'next/server'

/**
 * Study Groups API Routes
 */

/**
 * GET /api/study-groups - Get all study groups
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/study-groups?${searchParams}`
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch groups' }, { status: 500 })
  }
}

/**
 * POST /api/study-groups - Create a study group
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const body = await request.json()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups`, {
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
    return NextResponse.json({ message: 'Failed to create group' }, { status: 500 })
  }
}
