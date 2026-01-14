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
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

const steps = [
  { step: 1, title: "Step One", description: "Title & Description" },
  { step: 2, title: "Step Two", description: "Create a Slug" },
];

const projectSchema = z.object({
  title: z.string().min(5).max(40),
  description: z.string().min(10).max(100),
  slug: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9-]+$/, "Only lowercase, numbers and dashes"),
});

function ProjectStep() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "Send me your testimonial",
    description: "Your opinion helps me to keep improving.",
    slug: "",
  });

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
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep((prev) => prev + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    const result = projectSchema.safeParse(formData);
    if (!result.success) {
      console.error(result.error.format());
      return;
    }

    setLoading(true);
    const { data, error } = await privateApi["new-link"].post(formData);

    if (error) {
      toast.error(error.value.error as string);
      setLoading(false);
      return;
    }
    window.location.replace(`/p/${data.slug}`);
  };

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
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Creating
            </div>
          ) : currentStep === 2 ? (
            "Create"
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  );
}

export { ProjectStep };
