import { ToggleSession } from "./toggle-session";
import { ToggleTheme } from "./toggle-theme";
import NavLinks from "./nav-links";
import { Suspense } from "react";

export default function Aside() {
  return (
    <aside className="md:sticky md:top-10 h-screen md:h-[calc(100vh-80px)] space-y-6 flex flex-col border-b md:border-b-0 md:border-r border-border/40 pb-10 md:pb-10 md:pr-10">
      <div className="flex flex-col gap-4">
        <ToggleTheme />
      </div>
      <Suspense>
        <NavLinks />
      </Suspense>
      <div className="mt-auto">
        <ToggleSession />
      </div>
    </aside>
  );
}
