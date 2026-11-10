import React, { useState } from 'react';
import { ALL_ANDROID_FILES, AndroidSourceFile } from '../androidCode';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { 
  Folder, FileCode, Copy, Check, Search, Download, 
  Terminal, Shield, Database, Smartphone, BookOpen, Layers, BarChart3, Activity
} from 'lucide-react';

export const AndroidCodeStudio: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidSourceFile>(ALL_ANDROID_FILES[6]); // Default to DatabaseHelper.java
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'adminAnalytics' | 'setup' | 'architecture'>('code');

  const filteredFiles = ALL_ANDROID_FILES.filter(f => 
    f.path.toLowerCase().includes(search.toLowerCase()) ||
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.path.split('/').pop() || 'file.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Studio Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
            AS
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              <span>Android Studio Project Workspace</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/60">
                Java 8 • SDK 34 • SQLite
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Package: com.example.eventmanagementapp</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'code' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            File Explorer
          </button>
          <button
            onClick={() => setActiveTab('adminAnalytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'adminAnalytics' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-800 text-purple-300 hover:text-white'
            }`}
          >
            <BarChart3 size={13} />
            <span>Admin Module (Recharts)</span>
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'setup' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'architecture' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            DB Schema (13 Tables)
          </button>
        </div>
      </div>

      {activeTab === 'code' && (
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree Explorer Sidebar */}
          <div className="w-72 bg-slate-950/80 border-r border-slate-800/80 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter project files..."
                  className="w-full pl-7 pr-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 tracking-wider">
                Project Files ({filteredFiles.length})
              </div>
              {filteredFiles.map(file => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <FileCode size={14} className={isSelected ? 'text-white' : 'text-blue-400 shrink-0'} />
                    <div className="truncate">
                      <div className="truncate font-mono text-[11px] leading-tight">{file.path.split('/').pop()}</div>
                      <div className="truncate text-[9px] opacity-70 mt-0.5">{file.title}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {/* Action Bar */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {selectedFile.path}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
              </div>

              <div className="flex items-center gap-2">
                {selectedFile.path.toLowerCase().includes('admin') && (
                  <button
                    onClick={() => setActiveTab('adminAnalytics')}
                    className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Open interactive Recharts Attendance & Registration Dashboard"
                  >
                    <BarChart3 size={13} className="text-purple-400" />
                    <span className="hidden sm:inline">Recharts Dashboard</span>
                  </button>
                )}
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Content Box */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/90 selection:bg-blue-600 selection:text-white">
              <pre className="whitespace-pre">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'adminAnalytics' && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <AdminAnalyticsDashboard
            onNavigateToCode={(targetPath) => {
              if (targetPath) {
                const found = ALL_ANDROID_FILES.find(f => f.path.includes(targetPath) || targetPath.includes(f.path));
                if (found) setSelectedFile(found);
              }
              setActiveTab('code');
            }}
          />
        </div>
      )}

      {activeTab === 'setup' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Smartphone size={20} className="text-blue-400" />
              Android Studio Setup &amp; Build Procedure
            </h3>
            <p className="text-xs text-slate-400">
              Follow these exact steps to compile and run the application in Android Studio Hedgehog / Iguana / Jellyfish (2024+).
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-emerald-400">Step 1: Create New Android Studio Project</h4>
              <p className="text-xs text-slate-300">
                1. Open Android Studio → Select <strong>"New Project"</strong>.<br/>
                2. Choose <strong>"Empty Views Activity"</strong> (NOT Compose).<br/>
                3. Name: <strong>Event Management App</strong>.<br/>
                4. Package name: <strong>com.example.eventmanagementapp</strong>.<br/>
                5. Language: <strong>Java</strong>.<br/>
                6. Minimum SDK: <strong>API 24: Android 7.0 (Nougat)</strong> or higher.<br/>
                7. Build configuration language: <strong>Groovy DSL (build.gradle)</strong>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-emerald-400">Step 2: Add Dependencies in app/build.gradle</h4>
              <p className="text-xs text-slate-300">
                Open <code>app/build.gradle</code> and add these dependencies:
              </p>
              <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-blue-300 overflow-x-auto">
{`dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.cardview:cardview:1.0.0'
    implementation 'androidx.recyclerview:recyclerview:1.3.2'

    // ZXing QR Code Generation & Scanning
    implementation 'com.google.zxing:core:3.5.3'
    implementation 'com.journeyapps:zxing-android-embedded:4.3.0'
}`}
              </pre>
              <p className="text-xs text-slate-400">Click <strong>"Sync Now"</strong> in the top-right banner.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-emerald-400">Step 3: Setup Packages &amp; Files</h4>
              <p className="text-xs text-slate-300">
                Create the sub-packages under <code>app/src/main/java/com/example/eventmanagementapp/</code>:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                <li><code>database/DatabaseHelper.java</code></li>
                <li><code>utils/SessionManager.java</code> &amp; <code>utils/QRCodeHelper.java</code></li>
                <li><code>student/StudentDashboardActivity.java</code> (+ other student activities)</li>
                <li><code>staff/StaffDashboardActivity.java</code> (+ other staff activities)</li>
                <li><code>admin/AdminDashboardActivity.java</code> (+ other admin activities)</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-emerald-400">Step 4: Default Test Accounts</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-blue-400">Student Account</div>
                  <div>Username: <code>student</code></div>
                  <div>Password: <code>1234</code></div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-indigo-400">Staff Account</div>
                  <div>Username: <code>staff</code></div>
                  <div>Password: <code>1234</code></div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-purple-400">Admin Account</div>
                  <div>Username: <code>admin</code></div>
                  <div>Password: <code>admin123</code></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-300 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Database size={20} className="text-blue-400" />
              SQLite Database Architecture (SQLiteOpenHelper)
            </h3>
            <p className="text-slate-400">
              The application uses an embedded relational SQLite database with 13 tables, foreign keys, and automatic upgrades.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'users', desc: 'id, username, password, role (ADMIN/STAFF/STUDENT), status' },
              { name: 'students', desc: 'id, user_id, name, register_number, department, year, email, phone' },
              { name: 'staff', desc: 'id, user_id, name, staff_id, department, email, phone, status' },
              { name: 'events', desc: 'id, name, description, category, date, start_time, end_time, venue, event_type, capacity, status' },
              { name: 'registrations', desc: 'id, student_id, event_id, registration_id (unique pass ID), registration_date, status' },
              { name: 'waitlist', desc: 'id, student_id, event_id, position, status (auto-promoted on cancellations)' },
              { name: 'attendance', desc: 'id, student_id, event_id, check_in, check_out, status (Present/Absent)' },
              { name: 'certificates', desc: 'id, student_id, event_id, certificate_id, issue_date, status (VALID)' },
              { name: 'favorites', desc: 'id, student_id, event_id' },
              { name: 'feedback', desc: 'id, student_id, event_id, rating (1-5), comment, date' },
              { name: 'notifications', desc: 'id, user_id, title, message, date, is_read' },
              { name: 'activity_logs', desc: 'id, user_id, action, date, time (audit trail)' },
              { name: 'event_gallery', desc: 'id, event_id, image_path, caption' },
            ].map(t => (
              <div key={t.name} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="font-mono font-bold text-emerald-400">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
