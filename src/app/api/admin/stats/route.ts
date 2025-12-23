import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const stats = await db.vote.groupBy({
      by: ['teamId'],
      _count: {
        teamId: true
      }
    })

    const teams = await db.team.findMany({
      include: {
        votes: {
          select: {
            id: true,
            voterName: true,
            timestamp: true
          }
        }
      }
    })

    const totalVotes = await db.vote.count()

    return NextResponse.json({
      totalVotes,
      teams: teams.map(team => ({
        ...team,
        voteCount: team.votes.length
      })),
      stats
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    )
  }
}