import { CourseCarousel } from "@/components/home-page/course-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-1 container py-4">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 p-6 w-full">
        {/* Sidebar */}
        <aside className="col-span-1 p-4 border rounded-lg bg-white">
          <Card className="mb-4 p-4">
            <h2 className="text-lg font-bold">Invite friends</h2>
            <p className="text-sm">ABcDe89</p>
            <Button variant="outline" className="mt-2">
              Unlock lessons
            </Button>
          </Card>

          <Card className="mb-4 p-4">
            <h2 className="text-lg font-bold">Free 5 XP daily</h2>
            <div className="flex gap-3 justify-between">
              {[...Array(7)].map((_, i) => (
                <div className="flex flex-col gap-2 items-center ">
                  <div
                    key={i}
                    className={`h-4 w-4 rounded-full relative ${
                      i === 0 ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    {i === 0 && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    )}
                  </div>
                  <p className="text-[12px]">
                    {i === 0 ? "Today" : `Day ${i + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-4 p-4">
            <h2 className="text-lg font-bold">Streak</h2>
            <div className="flex gap-3 justify-between">
              {[...Array(7)].map((_, i) => (
                <div className="flex flex-col gap-2 items-center">
                  <div
                    key={i}
                    className={`h-4 w-4 rounded-full ${
                      i === 0 ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                  <p className="text-[12px]">
                    {i === 0 ? "Today" : `Day ${i + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-bold">League</h2>
            <div className="mt-2 space-y-2">
              {["Name A", "Name B", "Name C"].map((name, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {index + 1}. {name}
                  </span>
                  <span>{1000 - index * 150} XP</span>
                </div>
              ))}
            </div>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="col-span-2 p-4 border rounded-lg bg-white text-center">
          <h2 className="text-xl font-bold">All courses</h2>
          <div className="flex gap-2 my-3 justify-center">
            {["AI Learning", "Blockchain", "Cyber Security", "Canva"].map(
              (course, index) => (
                <Badge
                  key={index}
                  variant={index === 2 ? "destructive" : "default"}
                >
                  {course}
                </Badge>
              )
            )}
          </div>

          <Card className="px-10 border-none shadow-none">
            <h3 className="text-lg font-bold">Name of a course</h3>
            {/* <div className="h-40 bg-gray-200 mt-2 mb-4" /> */}
            <CourseCarousel />
            <p className="text-sm">5 modules - 30 lessons - 32 games</p>
            <Button className="mt-3">Start course</Button>
          </Card>
        </main>
      </div>
    </div>
  );
}
