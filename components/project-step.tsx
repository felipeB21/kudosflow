"use client";

import { useState } from "react";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { privateApi } from "@/lib/api";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import UserAvatar from "./user-avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";

const steps = [
  { step: 1, title: "Step One", description: "Title & Description" },
  { step: 2, title: "Step Two", description: "Slug & Custom Domain" },
  { step: 3, title: "Step Three", description: "Customize your Project" },
];

const projectSchema = z.object({
  title: z.string().min(5).max(40),
  description: z.string().min(10).max(100),
  slug: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9-]+$/, "Only lowercase, numbers and dashes"),
  customDomain: z.string().optional(),
  themeColor: z.string().startsWith("#"),
});

function ProjectStep() {
  const { push } = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "Send me your testimonial",
    description: "Your opinion helps me to keep improving.",
    slug: "",
    customDomain: "",
    themeColor: "#000000",
  });

  const { data: user } = authClient.useSession();

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.title.length >= 5 &&
          formData.title.length <= 40 &&
          formData.description.length >= 10 &&
          formData.description.length <= 100
        );
      case 2:
        return formData.slug.length >= 3 && /^[a-z0-9-]+$/.test(formData.slug);
      case 3:
        return formData.themeColor.startsWith("#");
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    const result = projectSchema.safeParse(formData);
    if (!result.success) {
      console.error(result.error.format());
      return;
    }

    setLoading(true);
    const { data, error } = await privateApi["new-project"].post(formData);

    if (error) {
      toast.error(error.value.error as string);
      setLoading(false);
      return;
    }
    window.location.replace(`/p/${data.slug}`);
  };

  function isDarkColor(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 128;
  }

  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto">
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        {steps.map(({ step, title, description }) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger className="max-md:flex-col pointer-events-none">
              <StepperIndicator />
              <div className="text-center md:text-left">
                <StepperTitle>{title}</StepperTitle>
                <StepperDescription className="max-sm:hidden">
                  {description}
                </StepperDescription>
              </div>
            </StepperTrigger>
            {step < steps.length && (
              <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
            )}
          </StepperItem>
        ))}
      </Stepper>

      <div>
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Send me your testimonial"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Your opinion helps me to keep improving."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="kudosflow"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
            <Label htmlFor="customDomain">Domain</Label>
            <Input
              id="customDomain"
              placeholder="https://kudosflow.com"
              value={formData.customDomain}
              onChange={(e) =>
                setFormData({ ...formData, customDomain: e.target.value })
              }
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 flex justify-between">
            <div className="flex flex-col gap-3 w-full">
              <Label htmlFor="themeColor">Color Theme</Label>
              <div className="relative w-20 h-20 border rounded-full">
                <Input
                  id="themeColor"
                  type="color"
                  value={formData.themeColor}
                  onChange={(e) =>
                    setFormData({ ...formData, themeColor: e.target.value })
                  }
                  className="
        absolute inset-0 w-full h-full p-0 border-none cursor-pointer rounded-full overflow-hidden appearance-none
        [&::-webkit-color-swatch-wrapper]:p-0 
        [&::-webkit-color-swatch]:border-none
        [&::-webkit-color-swatch]:rounded-full
        [&::-moz-color-swatch]:border-none
        [&::-moz-color-swatch]:rounded-full
      "
                />
              </div>
            </div>

            {/* Contenedor con el color dinámico */}
            <div
              className={`p-4 rounded-lg border w-full h-[20dvh] transition-colors duration-300 flex flex-col justify-between ${
                isDarkColor(formData.themeColor) ? "text-white" : "text-black"
              }`}
              style={{ backgroundColor: formData.themeColor }}
            >
              <div>
                <h1 className="text-lg font-bold">{formData.title}</h1>
                <p className="text-sm">{formData.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <span className="dark:text-stone-300 text-stone-700 text-sm font-bold">
                    {formData.slug}
                  </span>
                  <span className="dark:text-stone-300 text-stone-700 text-xs">
                    {formData.customDomain}
                  </span>
                </div>
                <Separator className="max-w-8 w-full" />
                <div className="flex items-center gap-2">
                  <UserAvatar user={user?.user} width={32} height={32} />
                  <div className="flex flex-col">
                    <p className="text-[13px] font-medium">{user?.user.name}</p>
                    <span className="text-xs">@{user?.user.username}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1 || loading}
        >
          Back
        </Button>

        <Button onClick={handleNext} disabled={!isStepValid() || loading}>
          {loading ? "Creating..." : currentStep === 3 ? "Create" : "Next"}
        </Button>
      </div>
    </div>
  );
}

export { ProjectStep };
