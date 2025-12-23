"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  Trophy,
  Vote,
  Target,
  BookOpen,
  Heart,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  Crown,
  User,
} from "lucide-react";
import Image from "next/image";

interface Team {
  id: string;
  name: string;
  description: string;
  vision: string;
  image: string | null;
  leader: string;
  coLeader: string;
  votes: Array<{
    id: string;
    voterName: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

type LiveResult = {
  id: string;
  name: string;
  voteCount: number;
  leader: string;
  coLeader: string;
};

export default function HomePage() {
  const [results, setResults] = useState<LiveResult[]>([]);

  useEffect(() => {
    const es = new EventSource("/api/live-results");

    es.onmessage = (event) => {
      setResults(JSON.parse(event.data));
    };

    return () => es.close();
  }, []);

  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch teams from API
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer (example: 7 days from now)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTotalVotes = (teams: LiveResult[]) => {
    return teams.reduce((total, team) => total + team.voteCount, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-blue-600">Loading election data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-blue-900">Election 2026</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:cursor-pointer hover:bg-blue-50"
                >
                  Home
                </Button>
              </Link>
              <Link href="/vote">
                <Button className="text-white bg-blue-600 hover:cursor-pointer hover:bg-blue-700">
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

        <div className="container relative flex items-center h-full px-4 mx-auto">
          <div className="max-w-3xl text-white">
            <div className="mb-6">
              <Trophy className="w-16 h-16 text-yellow-400" />
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              School Council Election 2026
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl">
              Your Voice, Your Choice, Your Future. Choose between two qualified
              teams to lead our student council.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/vote">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold text-blue-900 bg-yellow-500 hover:cursor-pointer hover:bg-yellow-400"
                >
                  Vote Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg text-blue-600 border-white hover:cursor-pointer hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-yellow-50">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="mb-4 text-4xl font-bold text-blue-900">
              Election Ends In
            </h2>
            <p className="text-xl text-blue-700">
              Cast your vote before time runs out!
            </p>
          </div>
          <div className="grid max-w-4xl grid-cols-2 gap-4 mx-auto md:grid-cols-4">
            <div className="text-center">
              <div className="p-6 text-white bg-blue-600 shadow-lg rounded-xl">
                <div className="mb-2 text-4xl font-bold">{timeLeft.days}</div>
                <div className="text-sm tracking-wide uppercase">Days</div>
              </div>
            </div>
            <div className="text-center">
              <div className="p-6 text-white bg-blue-600 shadow-lg rounded-xl">
                <div className="mb-2 text-4xl font-bold">{timeLeft.hours}</div>
                <div className="text-sm tracking-wide uppercase">Hours</div>
              </div>
            </div>
            <div className="text-center">
              <div className="p-6 text-white bg-blue-600 shadow-lg rounded-xl">
                <div className="mb-2 text-4xl font-bold">
                  {timeLeft.minutes}
                </div>
                <div className="text-sm tracking-wide uppercase">Minutes</div>
              </div>
            </div>
            <div className="text-center">
              <div className="p-6 text-white bg-blue-600 shadow-lg rounded-xl">
                <div className="mb-2 text-4xl font-bold">
                  {timeLeft.seconds}
                </div>
                <div className="text-sm tracking-wide uppercase">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Election Overview */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-blue-900">
              About the Election
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              This year's school council election features two qualified teams
              competing to lead our student body. Each team consists of a leader
              and co-leader who will work together to represent our school
              community.
            </p>
          </div>

          <div className="grid gap-8 mb-16 md:grid-cols-3">
            <Card className="p-6 text-center border-blue-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900">2 Teams</h3>
              <p className="text-gray-600">
                Each with a leader and co-leader ready to serve
              </p>
            </Card>
            <Card className="p-6 text-center border-blue-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <Vote className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900">
                One Vote Per Person
              </h3>
              <p className="text-gray-600">
                Fair and transparent voting process
              </p>
            </Card>
            <Card className="p-6 text-center border-blue-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900">
                Team-Based Voting
              </h3>
              <p className="text-gray-600">
                Vote for the team, not individual candidates
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-blue-900">
              Meet the Teams
            </h2>
            <p className="text-xl text-gray-600">
              Get to know the two teams running for this year's council election
            </p>
          </div>

          <div className="grid max-w-6xl gap-8 mx-auto md:grid-cols-2">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="overflow-hidden transition-shadow border-blue-200 hover:shadow-xl"
              >
                <div className="relative h-64">
                  {team.image ? (
                    <Image
                      src={team.image}
                      alt={team.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-blue-100">
                      <Users className="w-16 h-16 text-blue-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="font-semibold text-blue-900 bg-yellow-500">
                      {team.votes.length} votes
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">
                    {team.name}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-blue-700">
                    {team.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Team Members */}
                    <div>
                      <h4 className="flex items-center gap-2 mb-3 font-semibold text-blue-900">
                        <Users className="w-4 h-4" />
                        Team Members
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                          <Crown className="w-4 h-4 text-yellow-600" />
                          <div>
                            <div className="font-medium text-blue-900">
                              {team.leader}
                            </div>
                            <div className="text-sm text-gray-600">
                              Team Leader
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                          <User className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-blue-900">
                              {team.coLeader}
                            </div>
                            <div className="text-sm text-gray-600">
                              Co-Leader
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vision & Platform */}
                    <div>
                      <h4 className="flex items-center gap-2 mb-2 font-semibold text-blue-900">
                        <Target className="w-4 h-4" />
                        Vision & Platform
                      </h4>
                      <p className="leading-relaxed text-gray-700">
                        {team.vision}
                      </p>
                    </div>

                    {/* Key Initiatives */}
                    <div>
                      <h4 className="flex items-center gap-2 mb-2 font-semibold text-blue-900">
                        <Lightbulb className="w-4 h-4" />
                        Key Initiatives
                      </h4>
                      <ul className="space-y-1 text-gray-700">
                        {team.name === "Visionary Leaders" && (
                          <>
                            <li>• Academic excellence programs</li>
                            <li>• Student welfare initiatives</li>
                            <li>• Inclusive community building</li>
                            <li>• Innovation in education</li>
                          </>
                        )}
                        {team.name === "Future Forward" && (
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
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-blue-900">
              Live Election Results
            </h2>
            <p className="text-xl text-gray-600">
              Real-time voting results for each team
            </p>
          </div>

          <div className="grid max-w-4xl gap-8 mx-auto md:grid-cols-2">
            {results.map((team) => (
              <Card key={team.id} className="p-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-blue-900">
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 text-center">
                    <div className="mb-2 text-5xl font-bold text-blue-600">
                      {team.voteCount}
                    </div>
                    <div className="text-lg text-blue-700">Total Votes</div>
                    <div className="mt-2 text-sm text-blue-600">
                      {getTotalVotes(results) > 0 &&
                        Math.round(
                          (team.voteCount / getTotalVotes(results)) * 100
                        )}
                      % of all votes
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Leader:</span>
                      <span className="font-medium">{team.leader}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
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
                <CardTitle className="text-2xl text-center text-blue-900">
                  Vote Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((team) => (
                    <div key={team.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-900">
                          {team.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {team.voteCount} votes
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full">
                        <div
                          className="h-3 transition-all duration-500 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500"
                          style={{
                            width: `${
                              getTotalVotes(results) > 0
                                ? (team.voteCount / getTotalVotes(results)) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900">
                      Total Votes Cast:
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {getTotalVotes(results)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-blue-100">
            Every vote counts in shaping the future of our school. Choose the
            team that best represents your vision for our student council.
          </p>
          <Link href="/vote">
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold text-blue-900 bg-yellow-500 hover:bg-yellow-600"
            >
              Cast Your Vote Now <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-white bg-blue-900">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-xl font-bold text-yellow-400">
                About the Election
              </h3>
              <p className="leading-relaxed text-blue-100">
                This student council election gives you the power to choose
                between two qualified teams to lead our school community and
                make important decisions for our future.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-bold text-yellow-400">
                Important Dates
              </h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Voting Period: Nov 15-22, 2024</li>
                <li>• Results Announcement: Nov 23, 2024</li>
                <li>• New Council Takes Office: Dec 1, 2024</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-bold text-yellow-400">
                Contact & Support
              </h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Election Committee: election@school.edu</li>
                <li>• Student Affairs: (555) 123-4567</li>
                <li>• Main Office: Room 201</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-12 text-center border-t border-blue-800">
            <p className="text-blue-100">
              © 2024 School Council Election. All rights reserved. | Powered by
              Student Democracy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
