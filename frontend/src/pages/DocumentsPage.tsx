import { useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { DocumentIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import NavigationTabs from '@/components/NavigationTabs'
import UploadDocumentsDialog from '@/components/dialogs/UploadDocumentsDialog'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ROUTES } from '@/constants/routes'
import { useGetDocuments } from '@/queries/useGetDocuments'
import { getGreeting } from '@/utils/getGreeting'

const DocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: documents, isLoading } = useGetDocuments()

  const navigate = useNavigate()

  const filteredDocuments = documents
    ? documents.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  return (
    <div className="max-w-page mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{getGreeting()}</h1>
      <h2 className="md:text-lg font-medium text-gray-700">Here's an overview of your security posture</h2>

      <NavigationTabs />

      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-full">
            <Input
              placeholder="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 bg-white pl-10"
            />

            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 -translate-y-1/2 select-none stroke-2 text-gray-700" />
          </div>

          <UploadDocumentsDialog />
        </div>

        {!!documents?.length && (
          <Card className="overflow-hidden rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[500px] h-14 p-4">File Name</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="font-medium text-gray-800">
                {filteredDocuments.map((document) => (
                  <TableRow
                    key={document.name}
                    onClick={() => navigate(generatePath(ROUTES.improve, { documentName: document.name }))}
                    className="cursor-pointer hover:bg-[#fafafa]"
                  >
                    <TableCell className="h-16 p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-50 rounded-lg h-8 w-8 flex items-center justify-center shrink-0">
                          <DocumentIcon className="h-4 stroke-2 text-gray-600" />
                        </div>
                        {document.name}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!filteredDocuments.length && (
              <div className="flex items-center justify-center p-24 font-semibold text-gray-700 bg-[#fafafa]">
                <div>
                  No files found for: <strong> {searchQuery}</strong>
                </div>
              </div>
            )}
          </Card>
        )}

        {!documents?.length && !isLoading && (
          <Card className="flex items-center justify-center flex-col gap-4 h-[300px] border-dashed bg-white select-none">
            <img src="/search.png" className="h-24" />
            <div className="grid gap-0.5 text-center">
              <p className="text-gray-700 text-lg font-semibold">No Documents Found</p>
              <p className="text-gray-500 text-sm font-semibold">Uploaded documents will show here</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default DocumentsPage
