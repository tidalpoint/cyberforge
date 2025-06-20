import { FC, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { cn } from '@/utils/cn'
import { Card } from './ui/card'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

type Props = {
  file: string | File
  className?: string
}

const DocumentEmbed: FC<Props> = ({ file, className }) => {
  const [numPages, setNumPages] = useState<number>()

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <Document file={file} onLoadSuccess={onLoadSuccess} loading={<SkeletonLoader />} className="h-full">
        {numPages
          ? Array.from({ length: numPages }).map((_, idx) => (
              <Page
                key={`page-${idx + 1}`}
                pageNumber={idx + 1}
                renderTextLayer={false}
                loading={<SkeletonLoader />}
                width={656}
                className="border-b last:border-none"
              />
            ))
          : null}
      </Document>
    </Card>
  )
}

const SkeletonLoader = () => {
  return <div className="min-h-dvh h-full w-full" />
}

export default DocumentEmbed
