import React from 'react'

interface USMapSVGProps {
  className?: string
  fillColor?: string
  strokeColor?: string
  strokeWidth?: number
}

export function USMapSVG({ 
  className = '', 
  fillColor = 'currentColor', 
  strokeColor = '#e5e7eb', 
  strokeWidth = 1 
}: USMapSVGProps) {
  return (
    <svg
      viewBox="0 0 1000 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Continental United States - More accurate outline */}
      <path
        d="M 158 300 
           L 180 280 
           L 200 260 
           L 240 240 
           L 280 220 
           L 320 210 
           L 360 200 
           L 400 190 
           L 440 180 
           L 480 170 
           L 520 160 
           L 560 150 
           L 600 140 
           L 640 130 
           L 680 120 
           L 720 110 
           L 760 100 
           L 800 90 
           L 840 80 
           L 860 90 
           L 880 100 
           L 890 120 
           L 895 140 
           L 890 160 
           L 880 180 
           L 870 200 
           L 860 220 
           L 850 240 
           L 840 260 
           L 830 280 
           L 820 300 
           L 810 320 
           L 800 340 
           L 790 360 
           L 780 380 
           L 760 390 
           L 740 395 
           L 720 390 
           L 700 385 
           L 680 380 
           L 660 375 
           L 640 370 
           L 620 365 
           L 600 360 
           L 580 355 
           L 560 350 
           L 540 345 
           L 520 340 
           L 500 335 
           L 480 340 
           L 460 345 
           L 440 350 
           L 420 355 
           L 400 360 
           L 380 365 
           L 360 370 
           L 340 365 
           L 320 360 
           L 300 355 
           L 280 350 
           L 260 345 
           L 240 340 
           L 220 335 
           L 200 330 
           L 180 325 
           L 160 320 
           L 158 300 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      
      {/* State-like regions for visual reference */}
      <g fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.6">
        {/* Western states */}
        <path d="M 60 150 L 120 140 L 130 200 L 140 260 L 120 320 L 100 340 L 80 320 L 60 280 L 50 220 L 60 150 Z" />
        
        {/* Southwest */}
        <path d="M 140 260 L 200 250 L 280 240 L 320 260 L 350 300 L 380 340 L 350 370 L 320 360 L 280 350 L 240 340 L 200 330 L 160 320 L 140 260 Z" />
        
        {/* Central states */}
        <path d="M 350 300 L 420 290 L 480 280 L 520 270 L 560 260 L 580 300 L 570 340 L 540 360 L 500 370 L 460 365 L 420 355 L 380 365 L 350 300 Z" />
        
        {/* Texas */}
        <path d="M 380 340 L 450 330 L 500 335 L 520 360 L 510 400 L 480 420 L 440 415 L 400 405 L 380 380 L 380 340 Z" />
        
        {/* Southeast */}
        <path d="M 520 360 L 580 355 L 640 350 L 700 345 L 740 350 L 780 360 L 790 380 L 780 400 L 750 410 L 700 405 L 650 400 L 600 395 L 560 390 L 520 385 L 520 360 Z" />
        
        {/* Florida */}
        <path d="M 700 405 L 750 410 L 780 420 L 800 440 L 790 460 L 770 450 L 740 445 L 710 440 L 700 405 Z" />
        
        {/* Northeast */}
        <path d="M 700 250 L 760 240 L 800 230 L 840 220 L 860 240 L 870 260 L 860 280 L 840 290 L 800 300 L 760 310 L 720 320 L 700 300 L 700 250 Z" />
        
        {/* Great Lakes region */}
        <path d="M 580 200 L 640 190 L 680 180 L 720 170 L 740 200 L 730 230 L 700 250 L 660 260 L 620 270 L 580 260 L 560 230 L 580 200 Z" />
        
        {/* Northern plains */}
        <path d="M 420 180 L 480 170 L 540 160 L 580 150 L 600 180 L 590 210 L 560 230 L 520 240 L 480 250 L 440 260 L 420 230 L 420 180 Z" />
        
        {/* Mountain states */}
        <path d="M 200 180 L 280 170 L 360 160 L 420 180 L 400 220 L 380 260 L 350 300 L 320 260 L 280 240 L 240 220 L 200 200 L 200 180 Z" />
      </g>
      
      {/* Major cities dots for reference */}
      <g fill={strokeColor} opacity="0.4">
        <circle cx="80" cy="200" r="2" />   {/* San Francisco */}
        <circle cx="100" cy="280" r="2" />  {/* Los Angeles */}
        <circle cx="200" cy="320" r="2" />  {/* Phoenix */}
        <circle cx="300" cy="380" r="2" />  {/* San Antonio */}
        <circle cx="420" cy="350" r="2" />  {/* Houston */}
        <circle cx="500" cy="300" r="2" />  {/* Dallas */}
        <circle cx="580" cy="280" r="2" />  {/* Chicago */}
        <circle cx="680" cy="250" r="2" />  {/* Detroit */}
        <circle cx="780" cy="280" r="2" />  {/* New York */}
        <circle cx="750" cy="320" r="2" />  {/* Atlanta */}
        <circle cx="760" cy="400" r="2" />  {/* Miami */}
      </g>
    </svg>
  )
}
