import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { voterName, teamId } = body

    if (!voterName?.trim() || !teamId) {
      return NextResponse.json(
        { error: 'Voter name and team ID are required' },
        { status: 400 }
      )
    }

    // Get all existing votes to check for case insensitive match
    const allVotes = await db.vote.findMany({
      select: {
        voterName: true
      }
    })

    const hasVoted = allVotes.some(vote => 
      vote.voterName.toLowerCase() === voterName.trim().toLowerCase()
    )

    if (hasVoted) {
      return NextResponse.json(
        { error: 'You have already voted' },
        { status: 400 }
      )
    }

    // Check if team exists
    const team = await db.team.findUnique({
      where: { id: teamId }
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Create the vote
    const vote = await db.vote.create({
      data: {
        voterName: voterName.trim(),
        teamId
      },
      include: {
        team: {
          select: {
            name: true,
            leader: true,
            coLeader: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Vote cast successfully',
      vote: {
        id: vote.id,
        voterName: vote.voterName,
        team: vote.team,
        timestamp: vote.timestamp
      }
    })
  } catch (error) {
    console.error('Error casting vote:', error)
    return NextResponse.json(
      { error: 'Failed to cast vote' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const votes = await db.vote.findMany({
      include: {
        team: {
          select: {
            name: true,
            leader: true,
            coLeader: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    })

    // Get vote statistics
    const totalVotes = await db.vote.count()
    const votesByTeam = await db.vote.groupBy({
      by: ['teamId'],
      _count: {
        teamId: true
      }
    })

    return NextResponse.json({
      votes,
      totalVotes,
      votesByTeam
    })
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}