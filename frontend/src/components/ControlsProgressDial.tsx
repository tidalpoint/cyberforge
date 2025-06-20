import { FC } from 'react'
import { RadialBarChart, PolarGrid, RadialBar, PolarRadiusAxis, Label } from 'recharts'
import { cn } from '@/utils/cn'
import { getComplianceColor } from '@/utils/getComplianceColor'
import { ChartContainer } from './ui/chart'

type Props = {
  score: number
  scale?: number
  radiusScale?: number
  className?: string
  polarGridClassName?: string
  showLabel?: boolean
}

const ControlsProgressDial: FC<Props> = ({
  score,
  scale = 5,
  radiusScale = 4,
  className,
  polarGridClassName,
  showLabel,
}) => {
  return (
    <ChartContainer
      config={{}}
      style={{ '--compliance': getComplianceColor(score, scale) }}
      className={cn('size-16', className)}
    >
      <RadialBarChart
        data={[{ score, fill: 'hsl(var(--compliance))' }]}
        startAngle={0}
        endAngle={(score / scale) * 360}
        innerRadius={80 / radiusScale}
        outerRadius={110 / radiusScale}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className={cn('first:fill-muted last:fill-background', polarGridClassName)}
          polarRadius={[86 / radiusScale, 74 / radiusScale]}
        />
        <RadialBar dataKey="score" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          {showLabel && (
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan
                        x={(viewBox.cx || 50) + 1}
                        y={(viewBox.cy || 50) + 1}
                        className="font-bold fill-gray-700 text-[10px]"
                      >
                        {Math.round((score / scale) * 100)}%
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          )}
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}

export default ControlsProgressDial
