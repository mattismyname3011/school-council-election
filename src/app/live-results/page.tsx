"use client";

import { useEffect, useState } from "react";

type LiveResult = {
  id: string;
  name: string;
  voteCount: number;
};

export default function LiveResultsPage() {
  const [results, setResults] = useState<LiveResult[]>([]);

  useEffect(() => {
    const es = new EventSource("/api/live-results");

    es.onmessage = (event) => {
      setResults(JSON.parse(event.data));
    };

    return () => es.close();
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">📊 Live Results</h1>

      {results.map((team) => (
        <div
          key={team.id}
          className="flex justify-between p-4 mb-3 border rounded"
        >
          <span>{team.name}</span>
          <strong>{team.voteCount}</strong>
        </div>
      ))}
    </div>
  );
}
