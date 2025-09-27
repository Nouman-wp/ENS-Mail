import React from 'react';
import { useEnsText } from 'wagmi';
import { normalize } from 'viem/ens';

interface ENSTextRecordsProps {
  ensName: string;
  keys: string[];
}

const ENSTextRecords: React.FC<ENSTextRecordsProps> = ({ ensName, keys }) => {
  const textRecords = keys.map(key => {
    const { data: value, isLoading } = useEnsText({
      name: normalize(ensName),
      key,
      chainId: 1,
    });
    
    return { key, value, isLoading };
  });

  return (
    <div className="space-y-3">
      {textRecords.map(({ key, value, isLoading }) => (
        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
          <span className="text-gray-400 capitalize">
            {key.replace('com.', '').replace('_', ' ')}
          </span>
          <span className="text-white font-mono text-sm">
            {isLoading ? (
              <div className="animate-pulse bg-gray-700 h-4 w-20 rounded"></div>
            ) : value ? (
              <span className="break-all">{value}</span>
            ) : (
              <span className="text-gray-500 italic">Not set</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ENSTextRecords;
