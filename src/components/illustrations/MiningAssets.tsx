'use client'

type IconProps = {
  className?: string
  size?: number
}

// Professional side-view schematic of CAT 988 Loader
export function LoaderSchematic({ className = '', size = 120 }: IconProps) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 200 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wheels */}
      <circle cx="50" cy="90" r="25" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="50" cy="90" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="150" cy="90" r="25" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="150" cy="90" r="15" stroke="currentColor" strokeWidth="2" fill="none" />

      {/* Chassis */}
      <rect x="35" y="60" width="130" height="25" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />

      {/* Cab */}
      <path
        d="M 140 60 L 140 30 L 170 30 L 175 60 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Cab windows */}
      <rect x="145" y="35" width="15" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />

      {/* Engine compartment */}
      <rect x="25" y="50" width="25" height="30" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
      <line x1="30" y1="55" x2="45" y2="55" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="60" x2="45" y2="60" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="65" x2="45" y2="65" stroke="currentColor" strokeWidth="1.5" />

      {/* Bucket/Arm */}
      <path
        d="M 30 55 L 15 40 L 15 25 L 35 25 L 40 35 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.1"
      />

      {/* Hydraulic arms */}
      <line x1="35" y1="60" x2="25" y2="45" stroke="currentColor" strokeWidth="2" />
      <line x1="45" y1="60" x2="35" y2="40" stroke="currentColor" strokeWidth="2" />

      {/* Details */}
      <circle cx="175" cy="40" r="2" fill="currentColor" />
      <text x="100" y="110" fontSize="10" fill="currentColor" textAnchor="middle" fontFamily="monospace">
        CAT 988 LOADER
      </text>
    </svg>
  )
}

// Professional side-view schematic of CAT 789 Haul Truck
export function HaulTruckSchematic({ className = '', size = 140 }: IconProps) {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 220 140"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rear wheels (larger) */}
      <circle cx="160" cy="100" r="30" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="160" cy="100" r="18" stroke="currentColor" strokeWidth="2" fill="none" />

      {/* Front wheels */}
      <circle cx="60" cy="95" r="22" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="60" cy="95" r="13" stroke="currentColor" strokeWidth="2" fill="none" />

      {/* Chassis/Frame */}
      <rect x="45" y="70" width="130" height="20" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />

      {/* Tray/Bed */}
      <path
        d="M 85 70 L 85 30 L 190 30 L 200 50 L 200 70 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Tray support structure */}
      <line x1="100" y1="70" x2="100" y2="35" stroke="currentColor" strokeWidth="1.5" />
      <line x1="130" y1="70" x2="130" y2="35" stroke="currentColor" strokeWidth="1.5" />
      <line x1="160" y1="70" x2="160" y2="35" stroke="currentColor" strokeWidth="1.5" />

      {/* Cab */}
      <path
        d="M 40 70 L 40 40 L 55 35 L 75 35 L 80 70 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Cab windows */}
      <rect x="50" y="45" width="18" height="15" stroke="currentColor" strokeWidth="1.5" fill="none" />

      {/* Engine hood */}
      <rect x="25" y="60" width="15" height="25" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
      <line x1="28" y1="65" x2="37" y2="65" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="70" x2="37" y2="70" stroke="currentColor" strokeWidth="1.5" />

      {/* Ladder */}
      <line x1="82" y1="70" x2="82" y2="50" stroke="currentColor" strokeWidth="1.5" />
      <line x1="79" y1="65" x2="85" y2="65" stroke="currentColor" strokeWidth="1.5" />
      <line x1="79" y1="57" x2="85" y2="57" stroke="currentColor" strokeWidth="1.5" />

      <text x="110" y="125" fontSize="10" fill="currentColor" textAnchor="middle" fontFamily="monospace">
        CAT 789 HAUL TRUCK
      </text>
    </svg>
  )
}

// Professional side-view schematic of Excavator
export function ExcavatorSchematic({ className = '', size = 130 }: IconProps) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 200 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tracks */}
      <rect x="60" y="110" width="80" height="20" rx="10" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="75" cy="120" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="125" cy="120" r="8" stroke="currentColor" strokeWidth="2" fill="none" />

      {/* Base/Turret connection */}
      <rect x="75" y="90" width="50" height="20" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />

      {/* Cab/Turret */}
      <path
        d="M 70 90 L 70 60 L 90 55 L 120 55 L 130 90 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Cab window */}
      <rect x="85" y="65" width="25" height="15" stroke="currentColor" strokeWidth="1.5" fill="none" />

      {/* Boom (main arm) */}
      <line x1="110" y1="75" x2="160" y2="40" stroke="currentColor" strokeWidth="4" />

      {/* Stick (secondary arm) */}
      <line x1="160" y1="40" x2="185" y2="25" stroke="currentColor" strokeWidth="3.5" />

      {/* Bucket */}
      <path
        d="M 185 25 L 195 20 L 198 28 L 190 32 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.2"
      />

      {/* Hydraulic cylinders */}
      <line x1="115" y1="80" x2="145" y2="50" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="115" cy="80" r="3" fill="currentColor" />
      <circle cx="145" cy="50" r="3" fill="currentColor" />

      <line x1="165" y1="35" x2="180" y2="28" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="165" cy="35" r="3" fill="currentColor" />
      <circle cx="180" cy="28" r="3" fill="currentColor" />

      {/* Counterweight */}
      <rect x="55" y="75" width="20" height="25" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.2" />

      <text x="100" y="150" fontSize="10" fill="currentColor" textAnchor="middle" fontFamily="monospace">
        EXCAVATOR
      </text>
    </svg>
  )
}

// Light vehicle (side view)
export function LightVehicleSchematic({ className = '', size = 100 }: IconProps) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 160 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wheels */}
      <circle cx="40" cy="60" r="15" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="40" cy="60" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="120" cy="60" r="15" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="120" cy="60" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />

      {/* Chassis */}
      <rect x="25" y="40" width="110" height="15" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />

      {/* Cab */}
      <path
        d="M 45 40 L 45 20 L 75 18 L 95 20 L 95 40 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Windows */}
      <rect x="50" y="24" width="18" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="75" y="24" width="15" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />

      {/* Bed */}
      <rect x="95" y="25" width="35" height="15" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />

      <text x="80" y="72" fontSize="8" fill="currentColor" textAnchor="middle" fontFamily="monospace">
        LIGHT VEHICLE
      </text>
    </svg>
  )
}

// Safety/Infrastructure Icons

export function HardHatIcon({ className = '', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 10 35 Q 10 20, 25 15 Q 40 20, 40 35 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <line x1="10" y1="35" x2="40" y2="35" stroke="currentColor" strokeWidth="2.5" />
      <rect x="23" y="12" width="4" height="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  )
}

export function HighVisIcon({ className = '', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vest outline */}
      <path
        d="M 25 12 L 18 18 L 15 40 L 35 40 L 32 18 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Reflective strips */}
      <line x1="15" y1="22" x2="35" y2="22" stroke="currentColor" strokeWidth="2.5" />
      <line x1="15" y1="30" x2="35" y2="30" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}

export function RadioIcon({ className = '', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="18" y="15" width="14" height="25" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="20" y="18" width="10" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="22" y1="30" x2="28" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="22" y1="33" x2="28" y2="33" stroke="currentColor" strokeWidth="1.5" />
      <rect x="24" y="10" width="2" height="5" fill="currentColor" />
    </svg>
  )
}

export function TabletIcon({ className = '', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="12" y="8" width="26" height="34" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="15" y="11" width="20" height="26" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="25" cy="40" r="1.5" fill="currentColor" />
    </svg>
  )
}

// Site Infrastructure

export function CrusherIcon({ className = '', size = 60 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hopper */}
      <path
        d="M 20 15 L 60 15 L 50 35 L 30 35 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Main body */}
      <rect x="28" y="35" width="24" height="25" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
      {/* Output chute */}
      <path
        d="M 30 60 L 20 70 L 28 70 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.2"
      />
      {/* Conveyor */}
      <line x1="52" y1="50" x2="70" y2="35" stroke="currentColor" strokeWidth="2.5" />
      <line x1="52" y1="53" x2="70" y2="38" stroke="currentColor" strokeWidth="2" />
      <text x="40" y="75" fontSize="8" fill="currentColor" textAnchor="middle" fontFamily="monospace">CRUSHER</text>
    </svg>
  )
}

export function ControlRoomIcon({ className = '', size = 60 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Building */}
      <rect x="15" y="25" width="50" height="40" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
      {/* Windows */}
      <rect x="20" y="30" width="12" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="35" y="30" width="12" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="50" y="30" width="12" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Door */}
      <rect x="32" y="50" width="16" height="15" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      {/* Antenna */}
      <line x1="40" y1="25" x2="40" y2="15" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <text x="40" y="75" fontSize="8" fill="currentColor" textAnchor="middle" fontFamily="monospace">CONTROL</text>
    </svg>
  )
}

export function ROMPadIcon({ className = '', size = 60 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stockpile */}
      <path
        d="M 15 60 L 40 30 L 65 60 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Texture lines */}
      <line x1="25" y1="55" x2="30" y2="45" stroke="currentColor" strokeWidth="1.5" />
      <line x1="35" y1="55" x2="40" y2="40" stroke="currentColor" strokeWidth="1.5" />
      <line x1="45" y1="55" x2="50" y2="45" stroke="currentColor" strokeWidth="1.5" />
      <line x1="55" y1="55" x2="52" y2="50" stroke="currentColor" strokeWidth="1.5" />
      {/* Base */}
      <line x1="10" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="3" />
      <text x="40" y="75" fontSize="8" fill="currentColor" textAnchor="middle" fontFamily="monospace">ROM PAD</text>
    </svg>
  )
}
