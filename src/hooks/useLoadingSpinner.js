import { useMemo } from "react";

export default function UseLoadingSpinner(message = "Loading...") {
  return useMemo(() => {
    
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-3">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    );
  }, [message]);
}