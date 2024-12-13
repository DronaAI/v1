import React from 'react'
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react'

type MetricWithArrowProps = {
  label: string
  value: number
  trend: 'up' | 'down' | 'neutral'
}

export function MetricWithArrow({ label, value, trend }: MetricWithArrowProps) {
  const ArrowIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : ArrowRight
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-yellow-500'

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <ArrowIcon className={`w-6 h-6 ${trendColor}`} />
    </div>
  )
}

