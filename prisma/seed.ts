import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create two teams with leader and co-leader
  const teams = [
    {
      name: "Visionary Leaders",
      description:
        "Experienced leadership team focused on academic excellence and student welfare",
      vision:
        "Creating an inclusive educational environment that fosters academic achievement, personal growth, and community engagement through innovative programs and student-centered initiatives.",
      leader: "Sarah Johnson",
      coLeader: "Michael Chen",
      image: "/uploads/image_1766455914470.png",
    },
    {
      name: "Future Forward",
      description:
        "Dynamic team committed to sustainability, athletics, and campus improvement",
      vision:
        "Building a sustainable future for our school through environmental stewardship, athletic excellence, and facility improvements that benefit all students.",
      leader: "Emily Rodriguez",
      coLeader: "James Wilson",
      image: "/uploads/image_1766455926730.png",
    },
  ];

  console.log("Seeding teams...");

  for (const team of teams) {
    await prisma.team.create({
      data: team,
    });
  }

  console.log("Teams seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
