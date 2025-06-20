import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import FileDropzone, { CustomFileType } from '@/components/FileDropzone'
import OnboardingStep from '@/components/OnboardingStep'
import CompanyLogo from '@/components/icons/CompanyLogo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FRAMEWORKS } from '@/constants/frameworks'
import { ROUTES } from '@/constants/routes'
import { useSelectFramework } from '@/mutations/useSelectFramework'
import { useUploadFiles } from '@/mutations/useUploadFiles'
import { useGetComplianceProgress } from '@/queries/useGetComplianceProgress'
import { cn } from '@/utils/cn'

const OnboardingPage = () => {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState<CustomFileType[]>([])
  const [useSample, setUseSample] = useState(false)

  // note the discrepancies between framework name and id -> the backend considers the name field to be the id
  const [selectedFrameworkName, setSelectedFrameworkName] = useState<string>()

  const navigate = useNavigate()

  const { mutateAsync: uploadFiles, isPending: isUploadingFiles } = useUploadFiles()
  const { mutateAsync: selectFramework, isPending: isSelectingFramework } = useSelectFramework()

  const { data: complianceProgress } = useGetComplianceProgress({ enabled: step === 2, refetchOnMount: true })

  const handleUpload = async () => {
    const formData = new FormData()

    files.forEach(({ file }) => {
      formData.append('file', file)
    })

    try {
      const { csf_recommendations } = await uploadFiles({ formData, useSample, firstTime: true })

      setSelectedFrameworkName(csf_recommendations[0])
      setStep((prev) => prev + 1)
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const handleSaveFramework = async () => {
    try {
      if (!selectedFrameworkName) return

      await selectFramework({ frameworkId: selectedFrameworkName })

      navigate(ROUTES.home)
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  return (
    <div className="h-dvh w-full bg-gradient-to-b overflow-y-auto from-[#DCE3FF] via-[#DCE3FF] via-60% to-[#ffffff]">
      <div className="grid justify-center h-full w-full">
        {step === 1 && (
          <OnboardingStep className="zoom-in-[0.98]">
            <p className="text-2xl md:text-4xl text-gray-900 font-semibold">
              Welcome To <b className="text-[#163578]">CyberForge</b>
            </p>

            <p className="text-sm md:text-base text-gray-700 text-center font-semibold">
              Upload documents to get compliance insights. Some examples are <b>Annual reports</b>, <b>Org charts</b>,
              and <b>IT policies</b>.
            </p>

            <div className="mt-10 mb-8 w-full">
              <FileDropzone
                files={files}
                setFiles={setFiles}
                className="border-[#90A7FF] bg-[#f8f8f8] hover:bg-[#f3f3f3] "
              />
            </div>

            <div className="flex items-center justify-between gap-4 w-full mb-2">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="sample"
                  checked={useSample}
                  onCheckedChange={(checked) => setUseSample(!!checked)}
                  className="data-[state=checked]:bg-foreground"
                />
                <Label htmlFor="sample" className="text-gray-800 font-bold">
                  Use Sample Documents
                </Label>
              </div>

              <TooltipProvider delayDuration={250}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                      <InformationCircleIcon className="h-5 stroke-[2.25] text-gray-800" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="w-[300px] text-sm">
                    <p>
                      If you don't have your own policies - you can still preview the app by using our sample documents
                      for a fictitious Finance company called Maple Trust.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Button
              onClick={() => handleUpload()}
              isLoading={isUploadingFiles}
              disabled={!files.length && !useSample}
              className="h-16 w-full text-lg rounded-xl"
            >
              Continue
            </Button>
          </OnboardingStep>
        )}

        {step === 2 && (
          <OnboardingStep className="slide-in-from-right-3">
            <p className="text-2xl md:text-4xl text-gray-900 font-semibold">Select your framework</p>

            <p className="text-sm md:text-base text-gray-700 text-center font-semibold">
              We have selected the framework we think is best for you based on your documents. You can change it later.
            </p>

            <Progress value={complianceProgress} className="mt-8 h-2.5" />

            <div className="grid gap-3 my-4 w-full">
              {FRAMEWORKS.map((framework) => {
                const isSelected = selectedFrameworkName === framework.id

                return (
                  <button
                    key={framework.id}
                    type="button"
                    onClick={() => setSelectedFrameworkName(framework.id)}
                    className={cn(
                      'relative w-full p-4 rounded-lg flex items-center justify-between gap-4 bg-[#f8f8f8] hover:bg-[#f3f3f3] shadow-[0_0_0_1px_#cbcbcb]',
                      isSelected && 'shadow-[0_0_0_2px_#90A7FF]',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <img src={framework.image} alt={`${framework.name} logo`} draggable={false} className="size-8" />

                      <div className="text-left">
                        <p className={cn('font-bold text-[15px]', isSelected && 'text-primary')}>{framework.name}</p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'size-6 flex items-center justify-center rounded-full border shrink-0',
                        isSelected ? 'bg-primary border-[rgba(255,255,255,0.15)]' : 'border-[#dcdcdc]',
                      )}
                    >
                      {isSelected && <CheckIcon className="h-3.5 text-white stroke-[3]" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <Button
              onClick={() => handleSaveFramework()}
              isLoading={isSelectingFramework}
              className="h-16 w-full text-lg rounded-xl"
            >
              Complete
            </Button>
          </OnboardingStep>
        )}
      </div>

      <div className="absolute bottom-4 right-4 font-bold text-gray-600 text-xs flex items-center gap-2">
        <a href="https://tidalpoint.io" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#101047]">
          <CompanyLogo className="size-[18px]" /> Tidal Point Software
        </a>
      </div>
    </div>
  )
}

export default OnboardingPage
