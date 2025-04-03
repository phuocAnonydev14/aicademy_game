import { cn } from "@/utils/cn";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField: TextField,
    FieldMessage: FieldMessage,
  },
  formComponents: {
    SubmitButton: SubmitButton,
  },
  fieldContext,
  formContext,
});

function SubmitButton({
  children,
  ...props
}: PropsWithChildren & React.ComponentProps<typeof Button>) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => state.canSubmit}
      children={(canSubmit) => (
        <Button type="submit" disabled={!canSubmit} {...props}>
          {children}
        </Button>
      )}
    />
  );
}

function TextField(props: React.ComponentProps<"input">) {
  const field = useFieldContext<string>();
  return (
    <Input
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      {...props}
    />
  );
}

export function FieldMessage({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const field = useFieldContext<string>();
  return field.state.meta.errors.map((error) => (
    <p
      key={error.message}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {error.message}
    </p>
  ));
}

export { useAppForm };
