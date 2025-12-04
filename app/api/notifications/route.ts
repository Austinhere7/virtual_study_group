import { NextRequest, NextResponse } from 'next/server'

/**
 * Notifications API Routes
 */

/**
 * GET /api/notifications - Get user notifications
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { searchParams } = new URL(request.url)
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 })
  }
}

/**
 * DELETE /api/notifications - Delete all notifications
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { searchParams } = new URL(request.url)
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications?${searchParams}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete notifications' }, { status: 500 })
  }
}
