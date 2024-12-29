import { NextResponse } from 'next/server'
 
export async function GET() {
  return NextResponse.json(
    { message: 'Welcome to Study Planner API' },
    { status: 200 }
  )
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
