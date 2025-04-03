import {
  BotIcon,
  BriefcaseBusinessIcon,
  ComputerIcon,
  CrownIcon,
  PaintbrushIcon,
  RocketIcon,
  ShieldCheckIcon,
  SproutIcon,
  SwatchBookIcon,
  WaypointsIcon,
} from "lucide-react";
import type * as React from "react";

import { CourseTopics } from "@/components/course/nav-topics";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { CourseLevels } from "./nav-levels";
import { CourseSideHelp } from "./sidebar-form";

export const courseSidebar = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "All courses",
      url: "#",
      icon: SwatchBookIcon,
      isActive: true,
    },
    {
      title: "Artificial Intelligence",
      url: "#",
      icon: BotIcon,
      isActive: true,
    },
    {
      title: "Blockchain",
      url: "#",
      icon: WaypointsIcon,
    },
    {
      title: "Cybersecurity",
      url: "#",
      icon: ShieldCheckIcon,
    },
    {
      title: "Design",
      url: "#",
      icon: PaintbrushIcon,
    },
    {
      title: "Computer Science",
      url: "#",
      icon: ComputerIcon,
    },
    {
      title: "Business & Finance",
      url: "#",
      icon: BriefcaseBusinessIcon,
    },
  ],
  levels: [
    {
      name: "Beginner",
      url: "#",
      icon: SproutIcon,
    },
    {
      name: "Intermediate",
      url: "#",
      icon: RocketIcon,
    },
    {
      name: "Advanced",
      url: "#",
      icon: CrownIcon,
    },
  ],
};

export function CourseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <CourseTopics items={courseSidebar.navMain} />
        <CourseLevels items={courseSidebar.levels} />
      </SidebarContent>
      <SidebarFooter>
        <CourseSideHelp />
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  );
}
