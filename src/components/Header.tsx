import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./Searchbar"

export function Navbar({ className }: { className?: string }) {
  return (
    <header className={cn("sticky h-[80px] top-0 z-40 w-full border-b bg-[#fffff] backdrop-blur", className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 h-full">
      <a href="/" className="flex items-center space-x-2">
      <img
        src="/favicon.png"
        alt="ProCounsel icon"
        height={40}
        width={40}
      />
        <div className="flex flex-col leading-tight">
          <h1 className={`text-2xl font-bold text-orange-600`}>
            ProCounsel
          </h1>
          <span className={`text-xs text-gray-500`}>
            by catalystAI
          </span>
        </div>
    </a>

        <div className="hidden w-full max-w-xl md:block">
          <SearchBar size="sm" />
        </div>

        <Button
          asChild
          variant="outline"
          className="rounded-md border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
        >
          <a href="/auth">Login/Sign Up</a>
        </Button>
      </div>
    </header>
  )
}