"use client";

import { LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner"; // O tu librería de notificaciones

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/t/${slug}`;

    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="link" onClick={handleCopy} className="gap-2">
      {copied ? (
        <>
          {" "}
          Copied <Check className="w-4 h-4 " />{" "}
        </>
      ) : (
        <>
          {" "}
          Copy link <LinkIcon className="w-4 h-4" />{" "}
        </>
      )}
    </Button>
  );
}
