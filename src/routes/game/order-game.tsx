import WordPhysicsGame from "@/components/game/order";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game/order-game")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <WordPhysicsGame />
    </div>
  );
}
 