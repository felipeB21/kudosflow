"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface AuthAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  logoSrc: string;
  logoAlt?: string;
  title: string;
  description?: string;
  // Updated: Now accepts one or multiple actions
  primaryAction: AuthAction | AuthAction[];
  secondaryActions?: AuthAction[];
  skipAction?: {
    label: string;
    onClick: () => void;
  };
  footerContent?: React.ReactNode;
}

const AuthForm = React.forwardRef<HTMLDivElement, AuthFormProps>(
  (
    {
      className,
      logoSrc,
      logoAlt = "Company Logo",
      title,
      description,
      primaryAction,
      secondaryActions,
      skipAction,
      footerContent,
      ...props
    },
    ref
  ) => {
    const primaryActions = Array.isArray(primaryAction)
      ? primaryAction
      : [primaryAction];

    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
      >
        <Card
          ref={ref}
          className={cn(
            "w-full max-w-sm border-white/10 bg-zinc-950/50 backdrop-blur-xl",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500"
          )}
          {...props}
        >
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center ">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={100}
                height={100}
                className="h-12 w-12 object-contain rounded-lg"
              />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-zinc-400">
                {description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              {primaryActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={index === 0 ? "default" : "secondary"} // First one stands out
                  className="w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>

            {skipAction && (
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#09090b] px-2 text-zinc-500">or</span>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              {secondaryActions?.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full text-zinc-400 hover:text-white"
                  onClick={action.onClick}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>

          {skipAction && (
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-transparent text-white hover:text-stone-300 hover:bg-white/5"
                onClick={skipAction.onClick}
              >
                {skipAction.label}
              </Button>
            </CardFooter>
          )}
        </Card>

        {footerContent && (
          <div className="mt-6 w-full max-w-sm px-8 text-center text-sm text-zinc-500">
            {footerContent}
          </div>
        )}
      </div>
    );
  }
);
AuthForm.displayName = "AuthForm";

export { AuthForm };
