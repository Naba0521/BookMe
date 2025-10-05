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
        // Required: phoneNumber (experience and clientNumber are optional)
        return !!(
          values.phoneNumber?.trim() &&
          !errors.phoneNumber
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
        // Required: address only (city is optional)
        return !!(
          values.address?.trim() &&
          !errors.address
        );
        
      case 6:
        // Review step - check all required fields only
        return !!(
          values.email?.trim() &&
          values.password?.trim() &&
          values.confirmPassword?.trim() &&
          values.companyName?.trim() &&
          values.phoneNumber?.trim() &&
          values.openingHours &&
          values.lunchBreak &&
          values.address?.trim() &&
          !errors.email &&
          !errors.password &&
          !errors.confirmPassword &&
          !errors.companyName &&
          !errors.phoneNumber &&
          !errors.openingHours &&
          !errors.lunchBreak &&
          !errors.address
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
