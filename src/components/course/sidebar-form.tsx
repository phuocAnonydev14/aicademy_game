import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { MessageCircleIcon } from "lucide-react";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";

export function CourseSideHelp() {
  const sidebar = useSidebar();
  return (
    <Card className="shadow-none py-0 gap-0">
      <CardHeader
        className={sidebar.open || sidebar.openMobile ? "p-4 pb-0" : "hidden"}
      >
        <CardDescription>
          Not sure where to start? <br />
          Let us help you.
        </CardDescription>
      </CardHeader>
      <CardContent
        className={`grid ${sidebar.open || sidebar.openMobile ? "p-4" : "p-0"}`}
      >
        <SidebarMenuButton asChild tooltip={"Chat with Alice"}>
          <Button
            className="bg-sidebar-primary text-sidebar-primary-foreground shadow-none justify-normal"
            size="sm"
          >
            <MessageCircleIcon />
            <span>Chat with Alice</span>
          </Button>
        </SidebarMenuButton>
      </CardContent>
    </Card>
  );
}
