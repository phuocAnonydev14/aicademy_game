import BlindBoxGame from "@/components/game/blind-box";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game/blind-box-game")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <BlindBoxGame />
    </div>
  );
}
