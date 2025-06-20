export type DocumentSectionType = {
  section_id: string
  section_name: string
  section_text: string
}

export type DocumentType = {
  id: string
  name: string
  updatedAt: Date
  createdAt: Date
  section_list: DocumentSectionType[]
}
