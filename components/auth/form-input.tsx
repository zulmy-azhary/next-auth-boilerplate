import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Control, FieldValues, Path } from "react-hook-form";

type FormInputProps<T extends FieldValues> = React.InputHTMLAttributes<HTMLInputElement> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  isPending?: boolean;
};

export const FormInput = <T extends FieldValues>(props: FormInputProps<T>) => {
  const { control, name, label, isPending, ...rest } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...rest}
              className={cn(fieldState.error && "border-red-500")}
              disabled={isPending}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
