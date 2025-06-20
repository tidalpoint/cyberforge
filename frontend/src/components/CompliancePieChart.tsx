import { FC, useMemo } from 'react'
import { Label, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ComplianceType } from '@/types/Compliance'
import { cn } from '@/utils/cn'

type Props = {
  compliance: ComplianceType
  title?: string
  textContent?: { value: number; label: string }
  onClick?: () => void
  className?: string
}

const CompliancePieChart: FC<Props> = ({ compliance, title, textContent, onClick, className }) => {
  const chartData = [
    { compliance: 'Major', count: compliance.major, fill: 'hsl(var(--major))', stroke: 'hsl(var(--major))' },
    { compliance: 'Minor', count: compliance.minor, fill: 'hsl(var(--minor))', stroke: 'hsl(var(--minor))' },
    {
      compliance: 'Compliant',
      count: compliance.compliant,
      fill: 'hsl(var(--compliant))',
      stroke: 'hsl(var(--compliant))',
    },
  ]

  const totalControls = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
    <Card onClick={() => onClick?.()} className={cn('flex flex-col w-full', onClick && 'cursor-pointer')}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title || 'Current Control Status'}</CardTitle>
      </CardHeader>
      <CardContent className={cn('flex-1', className)}>
        <ChartContainer config={{}} className="mx-auto aspect-square max-h-[350px]">
          <PieChart className={cn('', onClick && '!cursor-pointer')}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="compliance"
              innerRadius={75}
              fillOpacity={0.65}
              strokeWidth={1}
              animationBegin={0}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {textContent?.value || totalControls.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          {textContent?.label || 'Total Controls'}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default CompliancePieChart
