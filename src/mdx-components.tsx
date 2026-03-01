import type { MDXComponents } from "mdx/types";
import Link from "next/link";

function SignupCTA() {
  return (
    <div className="my-8 p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-purple-950/20 text-center">
      <p className="text-lg font-semibold text-foreground mb-2">
        Get these insights delivered daily
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        AI Finance Brief analyzes 50+ sources every morning so you don&apos;t have to.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors"
      >
        Start Free
      </Link>
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    SignupCTA,
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
      href?.startsWith("/") ? (
        <Link href={href} {...props}>{children}</Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
      ),
  };
}
