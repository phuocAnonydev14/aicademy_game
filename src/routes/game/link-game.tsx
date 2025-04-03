import LinkGame from "@/components/game/link";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game/link-game")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LinkGame />
    </div>
  );
}
