import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

type FormToggleProps<T extends FieldValues> = React.ComponentPropsWithRef<"button"> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  isPending?: boolean;
  description: string;
};

export const FormToggle = <T extends FieldValues>(props: FormToggleProps<T>) => {
  const { control, name, label, description, isPending, ...rest } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">{label}</FormLabel>
          <div className="flex flex-row items-center justify-between rounded-lg border p-4 gap-x-6">
            <FormDescription>
              {description}
            </FormDescription>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isPending}
                {...rest}
              />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
};
