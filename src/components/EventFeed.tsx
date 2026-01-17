import { useGameStore } from '../game/store';

export const EventFeed = () => {
  const events = useGameStore((state) => state.eventLog);

  return (
    <div className="glass-panel rounded-2xl p-4 h-64 overflow-hidden flex flex-col">
      <p className="text-xs uppercase tracking-[0.3em] text-casino-200 mb-2">Event Feed</p>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {events.map((event, index) => (
          <div key={`${event}-${index}`} className="text-sm text-casino-200">
            {event}
          </div>
        ))}
      </div>
    </div>
  );
};
