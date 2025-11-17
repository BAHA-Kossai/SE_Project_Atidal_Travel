import {useState} from "react";

export default function Switch({ size = 32 }) {
    // Dynamic Values based on size
    const height = size;
    const width = size * 1.8;
    const padding = size * 0.125;
    const knobSize = size - padding * 2;

    const [checked, setChecked] = useState(true)

    return (
        <div
            className={`relative flex flex-row items-center
            ${checked ? "bg-sky-500 hover:bg-sky-600" : "bg-gray-200 hover:bg-gray-300"}
            duration-100 
            rounded-full cursor-pointer
            `}
            onClick={() => setChecked(!checked)}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                padding: `${padding}px`,
            }}
        >
      <span
          className={`${checked ? "bg-white" : "bg-gray-400"} rounded-full duration-100`}
          style={{
              // Dynamic Switching On/Off
              position: "absolute",
              left: `${checked ? width-7*padding : padding}px`,
              width: `${knobSize}px`,
              height: `${knobSize}px`,
          }}
      />
        </div>
    );
}
