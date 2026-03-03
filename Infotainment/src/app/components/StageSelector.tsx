import { Link } from "react-router";
import { Card } from "./ui/card";
import { 
  LayoutGrid, 
  Bell, 
  CheckSquare, 
  CheckCircle, 
  Clock 
} from "lucide-react";

export function StageSelector() {
  const stages = [
    {
      path: "/main",
      icon: LayoutGrid,
      title: "Stage 1: Main Page",
      description: "Tolling and parking services available",
      color: "blue",
    },
    {
      path: "/parking-confirmation",
      icon: CheckSquare,
      title: "Stage 2: Confirmation",
      description: "Car in park mode - confirm session",
      color: "orange",
    },
    {
      path: "/session-started",
      icon: CheckCircle,
      title: "Stage 3: Session Started",
      description: "Parking session confirmed",
      color: "green",
    },
    {
      path: "/session-active",
      icon: Clock,
      title: "Stage 4: Session Active",
      description: "View remaining time",
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Car Infotainment UI Stages
          </h1>
          <p className="text-gray-400 text-xl">
            Click any stage below to view the UI design
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <Link key={stage.path} to={stage.path}>
                <Card className="bg-gray-900 border-2 border-gray-700 p-8 hover:bg-gray-800 hover:border-blue-500 transition-all hover:scale-105 cursor-pointer h-full">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-blue-500/20 border-2 border-blue-500/50">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{stage.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="p-6 bg-blue-900/20 border-2 border-blue-800/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-300">📱 User Journey Flow</h3>
          <div className="flex items-center gap-3 text-gray-300 overflow-x-auto flex-wrap justify-center">
            <span className="whitespace-nowrap bg-gray-800 px-4 py-2 rounded-lg">Main Page</span>
            <span className="text-blue-400">→</span>
            <span className="whitespace-nowrap bg-gray-800 px-4 py-2 rounded-lg">Confirmation</span>
            <span className="text-blue-400">→</span>
            <span className="whitespace-nowrap bg-gray-800 px-4 py-2 rounded-lg">Session Started</span>
            <span className="text-blue-400">→</span>
            <span className="whitespace-nowrap bg-gray-800 px-4 py-2 rounded-lg">Session Active</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            💡 Each stage is a static UI design ready to copy to Figma
          </p>
        </div>
      </div>
    </div>
  );
}