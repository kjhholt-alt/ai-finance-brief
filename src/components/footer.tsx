import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm">
                AF
              </div>
              <span className="text-white font-semibold">
                AI Finance Brief
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered daily market intelligence for informed investors.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">Privacy Policy</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AI Finance Brief. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
