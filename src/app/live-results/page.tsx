// "use client";

// import { useEffect, useState } from "react";

// type LiveResult = {
//   id: string;
//   name: string;
//   voteCount: number;
// };

// export default function LiveResultsPage() {
//   const [results, setResults] = useState<LiveResult[]>([]);

//   useEffect(() => {
//     const es = new EventSource("/api/live-results");

//     es.onmessage = (event) => {
//       setResults(JSON.parse(event.data));
//     };

//     return () => es.close();
//   }, []);

//   return (
//     <div className="p-8">
//       <h1 className="mb-6 text-3xl font-bold">📊 Live Results</h1>

//       {results.map((team) => (
//         <div
//           key={team.id}
//           className="flex justify-between p-4 mb-3 border rounded"
//         >
//           <span>{team.name}</span>
//           <strong>{team.voteCount}</strong>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

type LiveResult = {
  id: string;
  name: string;
  voteCount: number;
};

export default function LiveResultsPage() {
  const [teams, setTeams] = useState<LiveResult[]>([]);

  useEffect(() => {
    const es = new EventSource("/api/live-results");

    es.onmessage = (event) => {
      setTeams(JSON.parse(event.data));
    };

    return () => es.close();
  }, []);

  const totalVotes = teams.reduce((sum, team) => sum + team.voteCount, 0);

  const sortedTeams = [...teams].sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          📊 Live Election Results
        </h1>

        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <span>
            Total Votes: <strong className="text-gray-900">{totalVotes}</strong>
          </span>

          <span className="flex items-center gap-1 font-semibold text-green-600">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto space-y-6">
        {sortedTeams.map((team, index) => {
          const percentage =
            totalVotes === 0
              ? 0
              : Math.round((team.voteCount / totalVotes) * 100);

          const isLeader = index === 0 && team.voteCount > 0;

          return (
            <div
              key={team.id}
              className={`rounded-xl border bg-white p-6 shadow-sm transition-all duration-500 ${
                isLeader ? "ring-2 ring-blue-500" : "hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                  <h2 className="text-lg font-semibold">{team.name}</h2>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">{percentage}%</p>
                  <p className="text-sm text-gray-500">
                    {team.voteCount} votes
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 overflow-hidden bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isLeader ? "bg-blue-600" : "bg-gray-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
