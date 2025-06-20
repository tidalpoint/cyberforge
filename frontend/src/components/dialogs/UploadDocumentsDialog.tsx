import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { useUploadFiles } from '@/mutations/useUploadFiles'
import FileDropzone, { CustomFileType } from '../FileDropzone'
import { Button } from '../ui/button'

const UploadDocumentsDialog = () => {
  const [files, setFiles] = useState<CustomFileType[]>([])
  const [open, setOpen] = useState(false)

  const { mutateAsync: uploadFiles, isPending } = useUploadFiles()

  const handleUpload = async () => {
    const formData = new FormData()

    files.forEach(({ file }) => {
      formData.append('file', file)
    })

    try {
      await uploadFiles({ formData })

      setOpen(false)
      toast.success('Documents uploaded successfully!')
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="pl-3">
          <PlusIcon className="h-5 stroke-2" />
          New Document
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>Upload New Documents</DialogHeader>

        <div className="bg-gray-200 p-12">
          <FileDropzone files={files} setFiles={setFiles} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>

          <Button onClick={() => handleUpload()} isLoading={isPending}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UploadDocumentsDialog
