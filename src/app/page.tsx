'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Calendar, Trophy, Vote, Target, BookOpen, Heart, Lightbulb, ChevronRight, ArrowRight, Crown, User } from 'lucide-react'
import Image from 'next/image'

interface Team {
  id: string
  name: string
  description: string
  vision: string
  image: string | null
  leader: string
  coLeader: string
  votes: Array<{
    id: string
    voterName: string
    timestamp: string
  }>
  createdAt: string
  updatedAt: string
}

export default function HomePage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Fetch teams from API
  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Countdown timer (example: 7 days from now)
  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 7)

    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getTotalVotes = () => {
    return teams.reduce((total, team) => total + team.votes.length, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Loading election data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-blue-900">Election 2024</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                  Home
                </Button>
              </Link>
              <Link href="/vote">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Cast Your Vote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/uploads/image_1766455140310.png"
            alt="School Campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <div className="mb-6">
              <Trophy className="w-16 h-16 text-yellow-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              School Council Election 2024
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Your Voice, Your Choice, Your Future. Choose between two qualified teams to lead our student council.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/vote">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold text-lg px-8 py-4">
                  Vote Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Calendar className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Election Ends In</h2>
            <p className="text-xl text-blue-700">Cast your vote before time runs out!</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl font-bold mb-2">{timeLeft.days}</div>
                <div className="text-sm uppercase tracking-wide">Days</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl font-bold mb-2">{timeLeft.hours}</div>
                <div className="text-sm uppercase tracking-wide">Hours</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl font-bold mb-2">{timeLeft.minutes}</div>
                <div className="text-sm uppercase tracking-wide">Minutes</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl font-bold mb-2">{timeLeft.seconds}</div>
                <div className="text-sm uppercase tracking-wide">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Election Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">About the Election</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This year's school council election features two qualified teams competing to lead our student body. 
              Each team consists of a leader and co-leader who will work together to represent our school community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">2 Teams</h3>
              <p className="text-gray-600">Each with a leader and co-leader ready to serve</p>
            </Card>
            <Card className="text-center p-6 border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">One Vote Per Person</h3>
              <p className="text-gray-600">Fair and transparent voting process</p>
            </Card>
            <Card className="text-center p-6 border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Team-Based Voting</h3>
              <p className="text-gray-600">Vote for the team, not individual candidates</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Meet the Teams</h2>
            <p className="text-xl text-gray-600">Get to know the two teams running for this year's council election</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {teams.map(team => (
              <Card key={team.id} className="overflow-hidden border-blue-200 hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  {team.image ? (
                    <Image
                      src={team.image}
                      alt={team.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-16 h-16 text-blue-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-blue-900 font-semibold">
                      {team.votes.length} votes
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">{team.name}</CardTitle>
                  <CardDescription className="text-lg font-medium text-blue-700">
                    {team.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Team Members */}
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Team Members
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                          <Crown className="w-4 h-4 text-yellow-600" />
                          <div>
                            <div className="font-medium text-blue-900">{team.leader}</div>
                            <div className="text-sm text-gray-600">Team Leader</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                          <User className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-blue-900">{team.coLeader}</div>
                            <div className="text-sm text-gray-600">Co-Leader</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Vision & Platform */}
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Vision & Platform
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{team.vision}</p>
                    </div>
                    
                    {/* Key Initiatives */}
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Key Initiatives
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        {team.name === 'Visionary Leaders' && (
                          <>
                            <li>• Academic excellence programs</li>
                            <li>• Student welfare initiatives</li>
                            <li>• Inclusive community building</li>
                            <li>• Innovation in education</li>
                          </>
                        )}
                        {team.name === 'Future Forward' && (
                          <>
                            <li>• Environmental sustainability</li>
                            <li>• Athletic facility improvements</li>
                            <li>• Campus modernization</li>
                            <li>• Health and wellness programs</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Statistics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Live Election Results</h2>
            <p className="text-xl text-gray-600">Real-time voting results for each team</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teams.map(team => (
              <Card key={team.id} className="p-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-blue-900">{team.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      {team.votes.length}
                    </div>
                    <div className="text-lg text-blue-700">
                      Total Votes
                    </div>
                    <div className="text-sm text-blue-600 mt-2">
                      {getTotalVotes() > 0 && Math.round((team.votes.length / getTotalVotes()) * 100)}% of all votes
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Leader:</span>
                      <span className="font-medium">{team.leader}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Co-Leader:</span>
                      <span className="font-medium">{team.coLeader}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-2xl mx-auto mt-8">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900 text-center">Vote Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.map(team => (
                    <div key={team.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-blue-900">{team.name}</span>
                        <span className="text-sm text-gray-600">{team.votes.length} votes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${getTotalVotes() > 0 ? (team.votes.length / getTotalVotes()) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-900">Total Votes Cast:</span>
                    <span className="text-xl font-bold text-blue-600">{getTotalVotes()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make Your Voice Heard?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Every vote counts in shaping the future of our school. Choose the team that best represents your vision for our student council.
          </p>
          <Link href="/vote">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold text-lg px-8 py-4">
              Cast Your Vote Now <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">About the Election</h3>
              <p className="text-blue-100 leading-relaxed">
                This student council election gives you the power to choose between two qualified teams to lead our school community and make important decisions for our future.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Important Dates</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Voting Period: Nov 15-22, 2024</li>
                <li>• Results Announcement: Nov 23, 2024</li>
                <li>• New Council Takes Office: Dec 1, 2024</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Contact & Support</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Election Committee: election@school.edu</li>
                <li>• Student Affairs: (555) 123-4567</li>
                <li>• Main Office: Room 201</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-12 pt-8 text-center">
            <p className="text-blue-100">
              © 2024 School Council Election. All rights reserved. | Powered by Student Democracy
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}