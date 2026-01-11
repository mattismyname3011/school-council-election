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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Vote,
  Users,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Shield,
  Clock,
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

export default function VotePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [voterName, setVoterName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [voteMessage, setVoteMessage] = useState("");

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

  const handleVote = async () => {
    if (!voterName.trim()) {
      setVoteMessage("Please enter your name");
      return;
    }

    if (!selectedTeam) {
      setVoteMessage("Please select a team");
      return;
    }

    setIsSubmitting(true);
    setVoteMessage("");

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voterName: voterName.trim(),
          teamId: selectedTeam,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setHasVoted(true);
        setVoteMessage(
          `Thank you for voting! Your vote for ${data.vote.team.name} has been recorded successfully.`
        );
        // Refresh teams to update vote counts
        await fetchTeams();
        setVoterName("");
        setSelectedTeam("");
      } else {
        setVoteMessage(data.error || "Failed to cast vote");
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      setVoteMessage("Failed to cast vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalVotes = () => {
    return teams.reduce((total, team) => total + team.votes.length, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-blue-600">Loading voting booth...</p>
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
              <Vote className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-blue-900">Voting Booth</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-blue-600 cursor-pointer hover:bg-blue-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container px-4 mx-auto text-center">
          <Vote className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Cast Your Vote
          </h1>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-blue-100">
            Your vote matters! Choose the team you believe will best represent
            our school community. Each team consists of a leader and co-leader
            who will work together for our school.
          </p>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-8 bg-yellow-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 p-6 border border-blue-200 rounded-lg bg-blue-50">
              <Shield className="flex-shrink-0 w-8 h-8 text-blue-600" />
              <div>
                <h3 className="mb-2 font-semibold text-blue-900">
                  Secure Team-Based Voting
                </h3>
                <p className="text-blue-700">
                  This voting system ensures one vote per person. You are voting
                  for a team (leader + co-leader), not individual candidates.
                  Your vote is confidential and will be counted accurately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Voting Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <Vote className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <CardTitle className="text-2xl text-blue-900">
                    Voting Form
                  </CardTitle>
                  <CardDescription>
                    Select the team you want to lead our student council
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {hasVoted && voteMessage && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {voteMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {voteMessage && !hasVoted && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {voteMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="voterName"
                      className="text-base font-medium text-blue-900"
                    >
                      Your Full Name *
                    </Label>
                    <Input
                      id="voterName"
                      placeholder="Enter your full name as it appears in school records"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      className="h-12 text-base border-blue-200 focus:border-blue-400"
                      disabled={hasVoted}
                    />
                    <p className="text-sm text-gray-600">
                      This will be used to verify your identity and prevent
                      duplicate voting
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-blue-900">
                      Select Your Team *
                    </Label>
                    <div className="space-y-4 overflow-y-auto max-h-96">
                      {teams.map((team) => (
                        <div
                          key={team.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedTeam === team.id
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                          }`}
                          onClick={() => !hasVoted && setSelectedTeam(team.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 overflow-hidden bg-blue-100 rounded-lg">
                              {team.image ? (
                                <Image
                                  src={team.image}
                                  alt={team.name}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              ) : (
                                <Users className="w-8 h-8 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-medium text-blue-900">
                                {team.name}
                              </div>
                              <div className="mb-2 text-sm text-gray-600">
                                {team.description}
                              </div>

                              {/* Team Members */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Crown className="w-3 h-3 text-yellow-600" />
                                  <span className="font-medium">
                                    {team.leader}
                                  </span>
                                  <span className="text-gray-500">
                                    (Leader)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="w-3 h-3 text-blue-600" />
                                  <span className="font-medium">
                                    {team.coLeader}
                                  </span>
                                  <span className="text-gray-500">
                                    (Co-Leader)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right blur-sm">
                              <div className="text-sm font-medium text-blue-600">
                                {team.votes.length}
                              </div>
                              <div className="text-xs text-gray-500">votes</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleVote}
                    disabled={
                      hasVoted ||
                      !voterName.trim() ||
                      !selectedTeam ||
                      isSubmitting
                    }
                    className="w-full py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Casting Vote...
                      </>
                    ) : hasVoted ? (
                      "Vote Successfully Cast"
                    ) : (
                      "Submit Your Vote"
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-center text-gray-600">
                    <Clock className="w-4 h-4" />
                    One vote per person. Choose your team wisely!
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Results */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">
                    Live Results
                  </CardTitle>
                  <CardDescription>
                    Current voting statistics in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 text-center rounded-lg bg-blue-50">
                      <div className="mb-2 text-4xl font-bold text-blue-600 blur-sm">
                        {getTotalVotes()}
                      </div>
                      <div className="text-lg text-blue-700">
                        Total Votes Cast
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-900">
                        Team Results
                      </h4>
                      {teams.map((team) => (
                        <div key={team.id} className="space-y-2 blur-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-blue-100 rounded-lg">
                                {team.image ? (
                                  <Image
                                    src={team.image}
                                    alt={team.name}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                ) : (
                                  <Users className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-blue-900 ">
                                {team.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-medium text-blue-900">
                                {team.votes.length}
                              </span>
                              <span className="ml-1 text-xs text-gray-500">
                                (
                                {getTotalVotes() > 0
                                  ? Math.round(
                                      (team.votes.length / getTotalVotes()) *
                                        100
                                    )
                                  : 0}
                                %)
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 transition-all duration-500 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500"
                              style={{
                                width: `${
                                  getTotalVotes() > 0
                                    ? (team.votes.length / getTotalVotes()) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Team Details */}
                    <div className="grid grid-cols-1 gap-4 pt-4 border-t">
                      {teams.map((team) => (
                        <div
                          key={team.id}
                          className="p-4 rounded-lg bg-gray-50"
                        >
                          <div className="mb-2 font-semibold text-blue-900">
                            {team.name}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>• Leader: {team.leader}</div>
                            <div>• Co-Leader: {team.coLeader}</div>
                            <div className="blur-sm">
                              • Votes: {team.votes.length}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 mt-16 text-white bg-blue-900">
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <p className="mb-4 text-blue-100">
              Thank you for participating in our democratic process
            </p>
            <Link href="/">
              <Button className="text-blue-900 bg-yellow-500 hover:bg-yellow-400 hover:cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="pt-8 mt-8 text-center border-t border-blue-800">
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
