interface ChartDataPoint {
  time: string;
  value: number;
  people: number;
}

interface VibeFlowChartProps {
  period?: 'hoje' | 'ontem' | 'semana';
}

const datasets: Record<string, ChartDataPoint[]> = {
  hoje: [
    { time: '18h', value: 10, people: 30 },
    { time: '19h', value: 25, people: 75 },
    { time: '20h', value: 45, people: 135 },
    { time: '21h', value: 65, people: 195 },
    { time: '22h', value: 85, people: 255 },
    { time: '23h', value: 100, people: 300 },
    { time: '00h', value: 95, people: 285 },
    { time: '01h', value: 80, people: 240 },
    { time: '02h', value: 50, people: 150 },
    { time: '03h', value: 20, people: 60 },
  ],
  ontem: [
    { time: '18h', value: 8, people: 24 },
    { time: '19h', value: 20, people: 60 },
    { time: '20h', value: 40, people: 120 },
    { time: '21h', value: 60, people: 180 },
    { time: '22h', value: 90, people: 270 },
    { time: '23h', value: 95, people: 285 },
    { time: '00h', value: 75, people: 225 },
    { time: '01h', value: 55, people: 165 },
    { time: '02h', value: 30, people: 90 },
    { time: '03h', value: 10, people: 30 },
  ],
  semana: [
    { time: '18h', value: 15, people: 45 },
    { time: '19h', value: 30, people: 90 },
    { time: '20h', value: 50, people: 150 },
    { time: '21h', value: 60, people: 180 },
    { time: '22h', value: 70, people: 210 },
    { time: '23h', value: 75, people: 225 },
    { time: '00h', value: 72, people: 216 },
    { time: '01h', value: 60, people: 180 },
    { time: '02h', value: 40, people: 120 },
    { time: '03h', value: 18, people: 54 },
  ],
};

export default function VibeFlowChart({ period = 'hoje' }: VibeFlowChartProps) {
  const data = datasets[period] || datasets.hoje;

  return (
    <div className="h-64 mt-6 flex items-end justify-between gap-2 px-2">
      {data.map((item) => {
        const heightPercent = `${item.value}%`;
        const isPeak = item.value > 80;

        return (
          <div key={item.time} className="flex flex-col items-center flex-1 group">
            <div className="relative w-full flex justify-center h-48 items-end rounded-t-sm">
              {/* Tooltip on hover */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-bg-dark text-xs font-bold py-1.5 px-3 rounded pointer-events-none z-10 shadow-lg whitespace-nowrap">
                {item.time} — {item.people} pessoas
              </div>
              
              <div
                style={{ height: heightPercent }}
                className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${
                  isPeak ? 'bg-gradient-to-t from-brand-fire/40 to-brand-fire shadow-md' : 'bg-white/10 group-hover:bg-white/20'
                }`}
              ></div>
            </div>
            <span className="text-xs text-gray-500 mt-2 font-medium">{item.time}</span>
            <span className="text-[10px] text-gray-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">{item.people}p</span>
          </div>
        );
      })}
    </div>
  );
}
