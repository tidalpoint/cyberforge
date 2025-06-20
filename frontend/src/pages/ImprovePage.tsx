import { useMemo, useState } from 'react'
import ReactDiffViewer from 'react-diff-viewer'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import DocumentEmbed from '@/components/DocumentEmbed'
import ReportIcon from '@/components/icons/ReportIcon'
import RisaLogo from '@/components/icons/RisaLogo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { useGetImprovedDocument } from '@/queries/useGetImprovedDocument'
import { useGetImprovedDocuments } from '@/queries/useGetImprovedDocuments'
import { useGetInputDocument } from '@/queries/useGetInputDocument'
import { cn } from '@/utils/cn'

type ViewType = 'docs' | 'diff'

const ImprovePage = () => {
  const [view, setView] = useState<ViewType>('docs')
  const { documentName } = useParams()

  const { data: inputDoc } = useGetInputDocument({ fileName: documentName })
  const { data: improvedDoc } = useGetImprovedDocument({ fileName: documentName })

  const { data: improvedDocs, isLoading } = useGetImprovedDocuments()

  const handleDownload = () => {
    if (!documentName || !improvedDoc) return

    const link = document.createElement('a')
    link.href = improvedDoc
    link.download = documentName
    link.click()
  }

  const DIFF = useMemo(() => {
    if (!improvedDocs?.length) return null

    const doc = improvedDocs.find((doc) => doc.name === documentName)

    if (!doc) return null

    return {
      old: doc.original_content,
      new: doc.improved_content,
    }
  }, [improvedDocs, documentName])

  if (!documentName) {
    return null
  }

  return (
    <div>
      <header className="flex items-center justify-center h-16 border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-[1408px] mx-auto w-full px-8">
          <div className="flex items-center gap-1.5 relative -left-1.5">
            <Button asChild variant="ghost" className="p-0 size-9">
              <Link to={ROUTES.documents}>
                <ArrowLeftIcon className="h-4 stroke-2" />
              </Link>
            </Button>

            <h2 className="font-semibold text-gray-800">{documentName}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => setView((prev) => (prev === 'diff' ? 'docs' : 'diff'))} variant="outline">
              {view === 'diff' ? 'Show Docs' : 'Show Diff'}
            </Button>
            <Button onClick={() => handleDownload()}>Download</Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1408px] mx-auto w-full px-8 py-12">
        {DIFF && view === 'diff' && <ReactDiffViewer oldValue={DIFF.old} newValue={DIFF.new} splitView={false} />}

        <div className={cn('flex items-center flex-col gap-8', view === 'diff' && 'hidden')}>
          {!DIFF && !isLoading && (
            <Card className="flex items-center justify-center flex-col gap-4 h-[250px] max-w-[660px] w-full border-dashed bg-white select-none">
              <img src="/search.png" className="h-24" />
              <div className="grid gap-0.5 text-center">
                <p className="text-gray-700 text-lg font-semibold">Working on Improved Document</p>
                <p className="text-gray-500 text-sm font-semibold">Try again in a minute</p>
              </div>
            </Card>
          )}

          <div className="flex flex-wrap justify-center gap-12 xl:gap-6">
            {inputDoc && (
              <div className="min-w-[660px]">
                <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-2">
                  <ReportIcon className="h-5 stroke-2" />
                  <h2 className="text-lg font-semibold">Current Policy</h2>
                </div>
                <DocumentEmbed file={inputDoc} className="outline outline-gray-300 outline-offset-1" />
              </div>
            )}

            {improvedDoc && (
              <div className="min-w-[660px]">
                <div className="flex items-center gap-2 font-semibold text-primary text-sm mb-2">
                  <ReportIcon className="h-5 stroke-2" />
                  <h2 className="text-lg font-semibold">Suggested Policy</h2>
                </div>

                <div className="relative">
                  <DocumentEmbed file={improvedDoc} className="outline outline-primary/50 outline-offset-1" />
                  <div className="bg-primary flex items-center justify-center size-8 rounded-full p-2 absolute -top-4 -right-4">
                    <RisaLogo className="text-background" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImprovePage
