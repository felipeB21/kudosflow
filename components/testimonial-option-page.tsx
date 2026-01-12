"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { FlowButton } from "./ui/flow-button";
import { ProjectStep } from "./project-step";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function TestimonialOptionPage() {
  const [view, setView] = useState<"options" | "create">("options");
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const handleCreateClick = () => {
    if (isPending) return;

    if (!session) {
      const currentPath = window.location.pathname;
      router.push(`/auth?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }
    setView("create");
  };

  return (
    <div className="mt-10 flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {view === "options" ? (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center gap-4 "
          >
            {/* Cambiamos el onClick para usar nuestra función de validación */}
            <div onClick={handleCreateClick}>
              <FlowButton text="Get Testimonials" />
            </div>

            <Button className="rounded-full cursor-pointer w-full" size={"xl"}>
              Send Testimonial
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="create-project"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.5,
              type: "spring",
              damping: 25,
              stiffness: 120,
            }}
            className="w-full"
          >
            <CreateProjectSettings onBack={() => setView("options")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CreateProjectSettings({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-stone-500 hover:text-black dark:hover:text-white transition-colors"
      >
        ← Go back
      </button>
      <ProjectStep />
    </div>
  );
}
