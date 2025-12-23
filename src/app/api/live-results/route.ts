import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendData = async () => {
        const teams = await prisma.team.findMany({
          select: {
            id: true,
            name: true,
            leader: true,
            coLeader: true,
            _count: {
              select: { votes: true },
            },
          },
        });

        const payload = teams.map((team) => ({
          id: team.id,
          name: team.name,
          voteCount: team._count.votes,
          leader: team.leader,
          coLeader: team.coLeader,
        }));

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        );
      };

      // Initial push
      await sendData();

      // Update every 2 seconds
      const interval = setInterval(sendData, 2000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
