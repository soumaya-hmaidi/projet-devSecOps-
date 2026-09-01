import { Network, GraduationCap, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gradient">CCNA Quiz</h3>
                <p className="text-sm text-muted-foreground">ESPRIT University</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive Cisco CCNA certification preparation platform for networking students at ESPRIT.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/register" className="text-muted-foreground hover:text-primary transition-colors">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* CCNA Topics */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">CCNA Topics</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Network Fundamentals</span>
              </li>
              <li>
                <span className="text-muted-foreground">Routing & Switching</span>
              </li>
              <li>
                <span className="text-muted-foreground">IP Connectivity</span>
              </li>
              <li>
                <span className="text-muted-foreground">Security Fundamentals</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">contact@esprit.tn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+216 70 685 685</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2025 CCNA Quiz - ESPRIT University. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>ESPRIT - School of Engineering</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
