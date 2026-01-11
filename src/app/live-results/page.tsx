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
    const targetDate = new Date("2026-01-30T23:59:59").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-500">
      {/* Navigation */}
      {/* Hero Section with Background Image */}
      {/* Countdown Section */}
      {/* Election Overview */}
      {/* Teams Section */}
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
              <Card key={team.id} className="p-8 border-2 border-gray-300">
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
            <Card className="p-8 border-2 border-gray-300">
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
      {/* Footer */}
    </div>
  );
}
