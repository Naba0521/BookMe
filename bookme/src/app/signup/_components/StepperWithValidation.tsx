"use client";

import { useFormContext } from "react-hook-form";
import Stepper, { Step } from "@/blocks/Components/Stepper/Stepper";
import { useStepValidation } from "./useStepValidation";
import { FullSchemaType } from "./Schemas";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { Step5 } from "./Step5";
import { Step6 } from "./Step6";
import { FormDataType } from "./Types";

interface StepperWithValidationProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  handleFinalSubmit: () => void;
  isSubmitting: boolean;
  dayLabels: Record<string, string>;
  formData: FormDataType;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  companyImagePreview: string[];
  removeCompanyImage: (index: number) => void;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoPreview: string;
  removeLogo: () => void;
}

export const StepperWithValidation = ({
  currentStep,
  setCurrentStep,
  handleFinalSubmit,
  isSubmitting,
  dayLabels,
  formData,
  handleImageChange,
  companyImagePreview,
  removeCompanyImage,
  handleLogoChange,
  logoPreview,
  removeLogo,
}: StepperWithValidationProps) => {
  const { getValues } = useFormContext<FullSchemaType>();
  const { isValid } = useStepValidation(currentStep);

  return (
    <Stepper
      initialStep={1}
      onStepChange={(step) => {
        setCurrentStep(step);
      }}
      onFinalStepCompleted={handleFinalSubmit}
      backButtonText="Буцах"
      nextButtonText={isSubmitting ? "Илгээж байна..." : "Дуусгах"}
      disabled={isSubmitting}
      isCurrentStepValid={isValid}
    >
      <Step>
        <Step1 />
      </Step>
      <Step>
        <Step2 />
      </Step>
      <Step>
        <Step3 dayLabels={dayLabels} />
      </Step>
      <Step>
        <div className="max-h-[70vh] overflow-auto px-2">
          <Step4
            formData={{
              ...getValues(),
              description: getValues().description ?? "",
              backGroundImage: getValues().backGroundImage ?? "",
              aboutUsImage: getValues().aboutUsImage ?? "",
            }}
            setFormData={() => {}}
            handleImageChange={handleImageChange}
            companyImagePreview={companyImagePreview}
            removeCompanyImage={removeCompanyImage}
            handleLogoChange={handleLogoChange}
            logoPreview={logoPreview}
            removeLogo={removeLogo}
          />
        </div>
      </Step>
      <Step>
        <Step5
          formData={getValues()}
          setFormData={() => {}}
        />
      </Step>
      <Step>
        <Step6
          formData={getValues()}
          setFormData={() => {}}
          dayLabels={dayLabels}
          companyImagePreview={companyImagePreview}
          logoPreview={logoPreview}
        />
      </Step>
    </Stepper>
  );
};
