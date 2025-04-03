 import { postsQueryOptions } from "@/services/courses.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions());
  },
  component: CoursesIndexComponent,
});

function CoursesIndexComponent() {
  const postsQuery = useSuspenseQuery(postsQueryOptions());
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3 xl:grid-cols-4">
      {postsQuery.data.map((post) => {
        return (
          <div key={post.id} className="rounded-xl bg-muted/50 p-4">
            <Link
              to="/courses/$postId"
              params={{
                postId: post.id,
              }}
              className="block py-1 text-blue-800 hover:text-blue-600"
              activeProps={{ className: "text-black font-bold" }}
            >
              <h3 className="text-sm line-clamp-2">{post.title}</h3>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
