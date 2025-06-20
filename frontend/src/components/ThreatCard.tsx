import { FC } from 'react'
import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { ThreatType } from '@/types/Threat'
import { cn } from '@/utils/cn'
import { getCompliance } from '@/utils/getCompliance'
import { getComplianceColor } from '@/utils/getComplianceColor'

type Props = {
  threat: ThreatType
  rank: number
}

const ThreatCard: FC<Props> = ({ threat, rank }) => {
  return (
    <div
      style={{ '--compliance': getComplianceColor(threat.score) }}
      className={cn(
        'text-gray-800 rounded-lg p-[2px] bg-gradient-to-r from-compliance to-[#e1e1e1] shadow-sm hover:scale-[1.01] transition duration-200 ease-in-out',
      )}
    >
      <Link to={generatePath(ROUTES.threat, { threatId: threat.id })}>
        <div className="rounded-lg bg-compliance h-full w-full">
          <div className="p-4 rounded-md bg-white/95 h-full w-full hover:bg-white/90 transition duration-200 ease-in-out">
            <h1
              className={cn(
                'text-green-900 font-semibold select-none',
                getCompliance(threat.score) === 'MAJOR' && 'text-red-900',
                getCompliance(threat.score) === 'MINOR' && 'text-amber-900',
              )}
            >
              {threat.name}
            </h1>

            {threat.reason && rank === 1 && (
              <p
                className={cn(
                  'text-green-700 font-medium text-sm select-none mt-2',
                  getCompliance(threat.score) === 'MAJOR' && 'text-red-700',
                  getCompliance(threat.score) === 'MINOR' && 'text-amber-700',
                )}
              >
                {threat.reason}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ThreatCard
