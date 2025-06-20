import { ChangeEvent, FC, useState } from 'react'
import { faker } from '@faker-js/faker'
import { DocumentIcon, TrashIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'
import { Button } from './ui/button'

export type CustomFileType = {
  id: string
  file: File
}

type Props = {
  files: CustomFileType[]
  setFiles: React.Dispatch<React.SetStateAction<CustomFileType[]>>
  className?: string
}

const FileDropzone: FC<Props> = ({ files, setFiles, className }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selectedFiles = Array.from(e.target.files).map((file) => ({ id: faker.string.uuid(), file }))
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files).map((file) => ({ id: faker.string.uuid(), file }))
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles])
    setIsDragging(false)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    setIsDragging(true)
  }

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          'border border-gray-300 border-dashed rounded-xl bg-[#fff] hover:bg-[#f3f3f3] p-14 flex flex-col items-center relative w-full shadow-md transition-colors duration-200',
          isDragging && 'bg-gray-200',
          className,
        )}
      >
        <h3 className="text-sm font-semibold text-[#565656]">Drop documents here</h3>
        <p className="mt-1 text-xs text-[#828080]">or, click to browse</p>

        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <p className="font-semibold text-gray-800 text-sm mb-1.5">Uploads</p>

          <ul className="grid gap-2">
            {files.map(({ id, file }) => (
              <li
                key={id}
                className="bg-white p-3 border rounded-xl flex items-center justify-between gap-3 animate-fade-in duration-500"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 rounded-md size-9 flex items-center justify-center shrink-0">
                    <DocumentIcon className="h-4 stroke-[2.25] text-gray-700" />
                  </div>

                  <div className="grid gap-0.5">
                    <p className="text-sm text-gray-800 font-semibold truncate">{file.name}</p>
                    <p className="text-xs text-gray-700 font-bold">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>

                <Button
                  onClick={() => setFiles((prev) => prev.filter((f) => f.id !== id))}
                  className="size-9 p-0 rounded-md bg-transparent hover:bg-destructive/10 shadow-none shrink-0"
                >
                  <TrashIcon className="h-5 stroke-[2] text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default FileDropzone
