import { X } from "lucide-react";
import React from "react";
import {
  digitGroups,
  digitRange,
  patternGroups,
} from "../../utils/Lottery2DUtils";

const TwoDQuickPickModal = ({ setSelectedNumbers, setShowQuickPickModal }) => {
  const handleSelect = (fn) => {
    setSelectedNumbers(fn());
    setShowQuickPickModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 max-w-[500px] mx-auto">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-black">အမြန်ရွေး</h2>
          <button
            onClick={() => setShowQuickPickModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-black">
          {/* Pattern Groups */}
          {patternGroups.map(({ title, options }) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <div className="grid grid-cols-4 gap-2">
                {options.map(({ label, fn }) => (
                  <button
                    key={label}
                    className="bg-blue-400 hover:bg-blue-500 font-medium py-2 px-3 rounded"
                    onClick={() => handleSelect(fn)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Digit Groups */}
          {digitGroups.map(({ title, fn }) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <div className="grid grid-cols-7 gap-2">
                {digitRange.map((num) => (
                  <button
                    key={`${title}-${num}`}
                    className="bg-blue-400 hover:bg-blue-500 border border-blue-500 py-2 px-3 rounded"
                    onClick={() => handleSelect(() => fn(num))}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Cancel */}
          <button
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded"
            onClick={() => setShowQuickPickModal(false)}
          >
            ပိတ်မည်
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoDQuickPickModal;
