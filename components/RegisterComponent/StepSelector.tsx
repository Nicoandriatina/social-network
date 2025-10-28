import { UserCircle, FileText, CheckCircle } from "lucide-react";

interface StepSelectorProps {
  current: number;
}

export default function StepSelector({ current }: StepSelectorProps) {
  const steps = [
    { label: "Profil", icon: UserCircle },
    { label: "Informations", icon: FileText },
    { label: "Finalisation", icon: CheckCircle },
  ];

  return (
    <div className="flex justify-center items-center mb-10 px-4">
      <div className="flex items-center max-w-2xl w-full">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < current;
          const isCurrent = index === current;
          const isPending = index > current;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-100"
                      : isCurrent
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white scale-110 ring-4 ring-indigo-200"
                      : "bg-gray-200 text-gray-400 scale-90"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
                  ) : (
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  )}
                </div>
                
                {/* Label */}
                <span
                  className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                    isCompleted || isCurrent ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-3 rounded-full transition-all duration-300">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index < current
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}