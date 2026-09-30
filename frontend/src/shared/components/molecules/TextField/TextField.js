import { Input } from "@/shared/components/atoms";
import { FormField } from "../FormField";

export function TextField({ id, label, error, hint, className, variant = "auth", srOnlyLabel = false, ...inputProps }) {
  return (
    <FormField id={id} label={srOnlyLabel ? null : label} error={error} hint={hint} className={className}>
      {(fieldProps) => (
        <Input variant={variant} aria-label={srOnlyLabel ? label : undefined} {...fieldProps} {...inputProps} />
      )}
    </FormField>
  );
}
