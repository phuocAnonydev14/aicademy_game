import { CourseBreadcrumb } from "@/components/course/breadcrumb";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { SidebarInset, SidebarProviderInner } from "@/components/ui/sidebar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [{ title: "Courses" }],
  }),
  component: CoursesComponent,
});

function CoursesComponent() {
  return (
    <SidebarProviderInner className="min-h-0 flex-1 h-[calc(100svh-var(--header-height)-1px)]!">
      <div className="flex flex-1 container">
        <CourseSidebar
          className="sticky top-(--header-height) h-full"
          aria-details={Route.id}
        />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 py-4 md:px-4">
            <CourseBreadcrumb />
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProviderInner>
  );
}
