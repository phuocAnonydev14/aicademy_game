import OrderingGame from '@/components/game/ordering-game';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game/ordering-game')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <OrderingGame />
    </div>
  );
}
