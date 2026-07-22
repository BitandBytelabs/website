import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Terminal, Server, Database, Cloud, ShieldCheck, CheckCircle2, Copy, BookOpen } from 'lucide-react';

interface DocsPageProps {
  onNavigate: (path: string) => void;
}

export const DocsPage: React.FC<DocsPageProps> = ({ onNavigate }) => {
  const [guideData, setGuideData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/docs/deployment-guide')
      .then(res => res.json())
      .then(data => setGuideData(data))
      .catch(err => console.error(err));
  }, []);

  const envExample = `# BIT & VOLT PRODUCTION .env CONFIGURATION
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/bit_and_volt?retryWrites=true&w=majority"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
JWT_SECRET="super_secret_jwt_key_replace_in_production"
SESSION_SECRET="super_secret_session_key"
NODE_ENV="production"
FRONTEND_URL="https://bit-and-volt.onrender.com"
`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* HEADER */}
      <div className="border-b border-[#1A1A1A] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#00FF41] uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          <span>PRODUCTION INFRASTRUCTURE SETUP GUIDE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight uppercase">
          $0-Budget Deployment Documentation
        </h1>
        <p className="text-[#888] text-sm font-sans leading-relaxed">
          Step-by-step instructions for deploying BIT & VOLT on Render, MongoDB Atlas Free Tier, Cloudinary, and UptimeRobot.
        </p>
      </div>

      {/* STACK SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-[#00FF41] flex items-center space-x-2 uppercase">
            <Server className="w-4 h-4" />
            <span>1. Render Free Tier Services</span>
          </h3>
          <p className="text-[#AAA] leading-relaxed font-sans">
            Deploy the Express Node.js server as a <strong>Render Web Service</strong> (command: <code>npm run start</code>). Deploy the React build output as a <strong>Render Static Site</strong>.
          </p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-[#FFB800] flex items-center space-x-2 uppercase">
            <Database className="w-4 h-4" />
            <span>2. MongoDB Atlas M0 Free Database</span>
          </h3>
          <p className="text-[#AAA] leading-relaxed font-sans">
            Provision a free M0 cluster on MongoDB Atlas. Create a database user and copy the connection string into <code>MONGODB_URI</code>.
          </p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-sky-400 flex items-center space-x-2 uppercase">
            <Cloud className="w-4 h-4" />
            <span>3. Cloudinary Free Media Storage</span>
          </h3>
          <p className="text-[#AAA] leading-relaxed font-sans">
            Store schematics, PCB images, and high-res project media on Cloudinary's 25 GB free storage tier.
          </p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-purple-400 flex items-center space-x-2 uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>4. UptimeRobot Keep-Alive Ping</span>
          </h3>
          <p className="text-[#AAA] leading-relaxed font-sans">
            Configure an HTTP monitor to ping <code>https://your-backend.onrender.com/api/health</code> every 5 minutes to keep the free container warm.
          </p>
        </div>
      </div>

      {/* ENVIRONMENT VARIABLES CODE BLOCK */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
          <span className="text-xs font-mono font-bold text-white uppercase">Production Environment Variables (.env)</span>
          <button
            onClick={copyEnv}
            className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#222] text-xs font-mono text-[#00FF41] flex items-center space-x-1 uppercase font-bold"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Template'}</span>
          </button>
        </div>

        <pre className="bg-[#0A0A0A] p-4 font-mono text-xs text-[#00FF41] overflow-x-auto border border-[#222]">
          {envExample}
        </pre>
      </div>

      {/* PRODUCTION SECURITY CHECKLIST */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 font-mono text-xs shadow-xl">
        <h3 className="text-base font-bold text-[#00FF41] flex items-center space-x-2 border-b border-[#1A1A1A] pb-2 uppercase">
          <CheckCircle2 className="w-5 h-5" />
          <span>Production Security & Verification Checklist</span>
        </h3>

        <ul className="space-y-2 text-[#AAA]">
          <li className="flex items-start space-x-2">
            <span className="text-[#00FF41] font-bold">✓</span>
            <span>Verify admin passwords are hashed with bcrypt (never stored in plaintext).</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#00FF41] font-bold">✓</span>
            <span>Verify HttpOnly / Bearer JWT tokens expire within 24 hours.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#00FF41] font-bold">✓</span>
            <span>Verify CORS origins are locked strictly to <code>FRONTEND_URL</code> in production.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#00FF41] font-bold">✓</span>
            <span>Verify rate limiting and input validation protect <code>/api/admin/login</code> against brute-force attacks.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#00FF41] font-bold">✓</span>
            <span>Verify <code>.env</code> file is included in <code>.gitignore</code> and never committed to public GitHub repositories.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
