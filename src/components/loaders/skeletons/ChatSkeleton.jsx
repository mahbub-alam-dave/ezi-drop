export default function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4 animate-pulse overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        <div className="flex-1 h-4 bg-gray-300 rounded w-1/3"></div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {/* Incoming messages */}
        <div className="flex items-start space-x-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </div>

        {/* Outgoing messages */}
        <div className="flex justify-end">
          <div className="space-y-2 text-right">
            <div className="h-4 bg-gray-300 rounded w-40 ml-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-24 ml-auto"></div>
          </div>
        </div>

        {/* Another incoming message */}
        <div className="flex items-start space-x-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-60"></div>
            <div className="h-4 bg-gray-300 rounded w-44"></div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="flex items-center space-x-3 border-t pt-3">
        <div className="h-10 bg-gray-300 rounded flex-1"></div>
        <div className="h-10 w-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
