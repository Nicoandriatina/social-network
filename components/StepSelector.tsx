interface StepSelectorProps {
  current: number;
}

export default function StepSelector({ current }: StepSelectorProps) {
  const steps = ["Profil", "Informations", "Finalisation"];

  return (
    <div className="flex justify-center mb-10">
      {steps.map((label, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-2 transition-all duration-300 ${
            index < current ? "bg-green-500 text-white" : index === current ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
          }`}>
            {index + 1}
          </div>
          <span className={`text-sm font-medium mr-4 ${
            index <= current ? "text-gray-800" : "text-gray-400"
          }`}>
            {label}
          </span>
          {index < steps.length - 1 && (
            <div className={`h-1 w-6 rounded-full ${
              index < current ? "bg-green-500" : "bg-gray-300"
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );
}
