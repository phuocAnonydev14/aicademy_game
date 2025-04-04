import { BubblePopGame } from '@/components/game/bubble';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game/bubble-game')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <BubblePopGame />
    </div>
  );
}
