import type React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

type Props = {
  children: React.ReactNode;
};

const OfflineMode = ({ children }: Props) => {
  const isOnline = useSelector((state: RootState) => state.network.isOnline);

  if (isOnline) {
    return <>{children}</>;
  }

  return (
    <div className="relative z-50 " >
      {/* Blurred content */}
      <div className="pointer-events-none blur-sm">
        {children}
      </div>
      
      {/* Overlay with message */} 
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-md p-3 mx-4 border border-gray-200 shadow-2xl bg-white/90 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Offline Mode
            </h3>
            
            {/* Message */}
            <p className="mb-4 text-gray-600">
              This feature is not available while offline. Please check your internet connection.
            </p>
            
            {/* Action hint */}
            <div className="flex items-center justify-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Reconnect to continue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;