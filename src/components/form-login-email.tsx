import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  loginWithEmail,
  loginWithEmailChallenge,
} from "@/services/auth.service";
import type { AuthOK } from "@/types/auth";
import { cn } from "@/utils/cn";
import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { MailIcon } from "lucide-react";
import { useAppForm } from "./form";
import { Button } from "./ui/button";

// const formSchemaLogin = type({
//   step: type.enumerated(1, 2),
//   email: "string.email",
//   otp: type("string.numeric").exactlyLength(6).optional(),
// }).narrow((data, ctx) => {
//   if (data.step === 2) {
//     if (!data.otp) {
//       ctx.mustBe("otp is missing");
//     }
//   }

//   return true;
// });

const formSchemaLogin = type({
  step: type.enumerated(1),
  email: "string.email",
}).or({
  step: type.enumerated(2),
  email: "string.email",
  otp: type("string.numeric").exactlyLength(6),
});

type FormSchemaLogin = typeof formSchemaLogin.infer;

export function FormLoginEmail({
  onSuccess,
}: {
  onSuccess?: (body: AuthOK) => void;
}) {
  const loginEmailChallenge = useMutation({
    mutationFn: async (value: { email: string }) => {
      return loginWithEmailChallenge(value);
    },
  });

  const loginEmailVerify = useMutation({
    mutationFn: async (value: { email: string; otp: string }) => {
      return loginWithEmail(value);
    },
  });

  const form = useAppForm({
    defaultValues: {
      step: 1,
      email: "",
    } as FormSchemaLogin,
    validators: {
      onSubmit: formSchemaLogin,
    },
    onSubmit: async ({ formApi, value }) => {
      if (value.step === 1) {
        const body = await loginEmailChallenge.mutateAsync(value);
        if ("code" in body) {
          // TODO: handle error
          return;
        }

        formApi.setFieldValue("email", body.data); // email got normalized
        formApi.setFieldValue("step", 2);
        return;
      }

      const body = await loginEmailVerify.mutateAsync(value);
      if ("code" in body) {
        // TODO: handle error
        return;
      }

      onSuccess?.(body.data);
      formApi.reset();
    },
  });

  return (
    <form
      className="w-full grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Subscribe
        selector={(state) => state.values.step}
        children={(step) =>
          step === 1 ? (
            <form.AppField
              name="email"
              children={(field) => (
                <>
                  <div className="relative w-full">
                    <field.TextField
                      className={cn(
                        "bg-background shadow-none pl-8 w-full min-w-0",
                      )}
                      placeholder="Your email"
                    />
                    <MailIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                  </div>

                  <field.FieldMessage />
                </>
              )}
            />
          ) : (
            <>
              <form.AppField
                name="email"
                children={(field) => (
                  <>
                    <div className="relative w-full">
                      <field.TextField
                        className={cn(
                          "bg-background shadow-none pl-8 w-full min-w-0",
                        )}
                        placeholder="Your email"
                        readOnly
                      />
                      <MailIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                    </div>
                  </>
                )}
              />

              <form.AppField
                name="otp"
                children={(field) => (
                  <>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      autoFocus
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>

                    {field.state.meta.errors.map((error) => (
                      // TODO: this is a bug with tanstack form
                      // might be the same as this: https://github.com/TanStack/form/issues/1172
                      <p
                        key={(error as unknown as Error).message}
                        className={cn("text-destructive text-sm")}
                      >
                        {(error as unknown as Error).message}
                      </p>
                    ))}
                  </>
                )}
              />
            </>
          )
        }
      />

      <form.AppForm>
        <form.SubmitButton className="w-full text-sm" size="sm">
          Continue
        </form.SubmitButton>
        <form.Subscribe
          selector={(state) => state.values.step}
          children={(step) =>
            step === 2 && (
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
                }}
              >
                Cancel
              </Button>
            )
          }
        />
      </form.AppForm>
    </form>
  );
}
