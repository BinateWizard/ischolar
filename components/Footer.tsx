"use client";

import { usePathname } from "next/navigation";

type Props = {
  forceRender?: boolean;
  fullScreen?: boolean; // make footer occupy full snap screen and center its content
};

export default function Footer({ forceRender = false, fullScreen = false }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith('/admin');
  // Hide global footer on home route unless explicitly forced by a page
  if ((isHome || isAdmin) && !forceRender) return null;

  const base = "bg-gray-900 text-gray-300";
  const frame = fullScreen ? "min-h-full h-full flex items-center" : "border-t border-gray-800";
  const pad = fullScreen ? "py-16" : "py-12";
  const classes = `${base} ${frame} ${pad} w-full`;

  return (
    <footer className={classes}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">iS</span>
              </div>
              <span className="text-white font-bold">iScholar</span>
            </div>
            <p className="text-sm text-gray-400">
              Scholarship management and application portal.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Apply Now</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Check Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Programs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Requirements</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Office of Student Affairs</li>
              <li className="text-blue-400">osa@university.edu.ph</li>
              <li>(049) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2025 iScholar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
