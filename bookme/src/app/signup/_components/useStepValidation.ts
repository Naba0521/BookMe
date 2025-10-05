import { useFormContext } from "react-hook-form";
import { FullSchemaType } from "./Schemas";

export const useStepValidation = (stepNumber: number) => {
  const { watch, formState: { errors } } = useFormContext<FullSchemaType>();
  
  const values = watch();
  
  const isStepValid = () => {
    switch (stepNumber) {
      case 1:
        // Required: email, password, confirmPassword, companyName
        return !!(
          values.email?.trim() &&
          values.password?.trim() &&
          values.confirmPassword?.trim() &&
          values.companyName?.trim() &&
          !errors.email &&
          !errors.password &&
          !errors.confirmPassword &&
          !errors.companyName
        );
        
      case 2:
        // Required: phone, experience, clientNumber
        return !!(
          values.phone?.trim() &&
          values.experience?.trim() &&
          values.clientNumber?.trim() &&
          !errors.phone &&
          !errors.experience &&
          !errors.clientNumber
        );
        
      case 3:
        // Required: openingHours and lunchBreak
        return !!(
          values.openingHours &&
          values.lunchBreak &&
          !errors.openingHours &&
          !errors.lunchBreak
        );
        
      case 4:
        // Optional step - always valid
        return true;
        
      case 5:
        // Required: address, city
        return !!(
          values.address?.trim() &&
          values.city?.trim() &&
          !errors.address &&
          !errors.city
        );
        
      case 6:
        // Review step - check all previous steps
        return !!(
          values.email?.trim() &&
          values.password?.trim() &&
          values.confirmPassword?.trim() &&
          values.companyName?.trim() &&
          values.phone?.trim() &&
          values.experience?.trim() &&
          values.clientNumber?.trim() &&
          values.openingHours &&
          values.lunchBreak &&
          values.address?.trim() &&
          values.city?.trim() &&
          !errors.email &&
          !errors.password &&
          !errors.confirmPassword &&
          !errors.companyName &&
          !errors.phone &&
          !errors.experience &&
          !errors.clientNumber &&
          !errors.openingHours &&
          !errors.lunchBreak &&
          !errors.address &&
          !errors.city
        );
        
      default:
        return false;
    }
  };

  return {
    isValid: isStepValid(),
    values,
    errors
  };
};
