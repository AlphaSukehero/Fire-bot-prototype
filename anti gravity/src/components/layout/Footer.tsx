import { Flame } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-ui-900 py-12 border-t border-ui-800 text-center relative z-10">
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Flame className="w-6 h-6 text-ui-warning" />
                    <span className="font-bold text-xl text-white tracking-tight">FireBot<span className="text-ui-warning">Sync</span></span>
                </div>
                <p className="text-ui-muted text-sm mb-6 leading-relaxed">
                    Intelligent fire detection and response system integrating embedded sensing,
                    cloud analytics, and inter-robot coordination. Developed utilizing Next.js, SQLite, and Tailwind.
                </p>
                <div className="text-ui-700 text-xs font-mono">
                    &copy; {new Date().getFullYear()} Cooperative Robotic Response System. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
