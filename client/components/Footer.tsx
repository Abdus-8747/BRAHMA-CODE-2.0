export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          © 2026 AI Mentor
        </p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a>Privacy</a>
          <a>Terms</a>
          <a>Contact</a>
        </div>
      </div>
    </footer>
  )
}
