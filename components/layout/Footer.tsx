import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Jethro Hawthorn.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/#phim-moi-cap-nhat" className="hover:text-foreground">
            Trang chủ
          </Link>
          <Link href="/admin/feedback" className="hover:text-foreground">
            Admin feedback
          </Link>
        </div>
      </div>
    </footer>
  );
}
