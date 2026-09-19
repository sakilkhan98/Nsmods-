/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Code, Copy, Check, Info, FileText, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

interface Snippet {
  id: string;
  name: string;
  description: string;
  params: { key: string; label: string; placeholder: string; defaultValue: string; type: 'text' | 'number' }[];
  generate: (params: Record<string, string>) => string;
  injectionGuide: string;
}

export default function SmaliCodegen() {
  const [copied, setCopied] = useState(false);
  const [selectedSnippetId, setSelectedSnippetId] = useState('toast');
  const [inputs, setInputs] = useState<Record<string, string>>({
    message: 'Hello, welcome to this modded app! 👋',
    url: 'https://t.me/Sharechat_ns_098',
    delay: '2000',
    activityName: 'com/nsmods/dialog/simpledialog',
  });

  const snippets: Snippet[] = [
    {
      id: 'toast',
      name: 'Show Custom Toast Message',
      description: 'Display an interactive toast notice at the bottom of the screen upon launching.',
      params: [
        { key: 'message', label: 'Toast Alert Message', placeholder: 'Enter alert message...', defaultValue: 'Hello, welcome to this modded app! 👋', type: 'text' }
      ],
      injectionGuide: 'Locate onCreate() inside your main launcher activity. Inject this snippet right after the call to invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V.',
      generate: (p) => {
        const escaped = (p.message || '').replace(/"/g, '\\"');
        return `# --- Injected Toast Message by NSMods PRO ---
    const-string v0, "${escaped}"
    const/4 v1, 0x1
    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;
    move-result-object v0
    invoke-virtual {v0}, Landroid/widget/Toast;->show()V
# --- End of Toast Injection ---`;
      }
    },
    {
      id: 'intent-url',
      name: 'Launch Web Browser Link',
      description: 'Redirect users directly to your Telegram channel, website or custom gateway.',
      params: [
        { key: 'url', label: 'Redirection Web URL', placeholder: 'https://t.me/yourchannel', defaultValue: 'https://t.me/Sharechat_ns_098', type: 'text' }
      ],
      injectionGuide: 'Inject inside onCreate() or any click listener method. Ensure register v0 and v1 are available for reuse.',
      generate: (p) => {
        const escapedUrl = (p.url || '').replace(/"/g, '\\"');
        return `# --- Injected Intent Web Launch by NSMods PRO ---
    new-instance v0, Landroid/content/Intent;
    const-string v1, "android.intent.action.VIEW"
    invoke-direct {v0, v1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    const-string v1, "${escapedUrl}"
    invoke-static {v1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v1
    invoke-virtual {v0, v1}, Landroid/content/Intent;->setData(Landroid/net/Uri;)Landroid/content/Intent;

    const/high16 v1, 0x10000000
    invoke-virtual {v0, v1}, Landroid/content/Intent;->setFlags(I)Landroid/content/Intent;

    invoke-virtual {p0, v0}, Landroid/content/Context;->startActivity(Landroid/content/Intent;)V
# --- End of Intent Injection ---`;
      }
    },
    {
      id: 'finish-act',
      name: 'Finish & Exit Activity',
      description: 'Instantly terminate the current screen layout to trigger force exits or blocks.',
      params: [],
      injectionGuide: 'Replace any returning statements (like return-void) or add immediately inside your conditional branches.',
      generate: () => {
        return `# --- Injected Exit Code by NSMods PRO ---
    invoke-virtual {p0}, Landroid/app/Activity;->finish()V
    return-void
# --- End of Exit Injection ---`;
      }
    },
    {
      id: 'delay-action',
      name: 'Delayed Action Handler',
      description: 'Schedule actions to run asynchronously after a specified millisecond delay interval.',
      params: [
        { key: 'delay', label: 'Delay (in milliseconds)', placeholder: '2000', defaultValue: '2000', type: 'number' }
      ],
      injectionGuide: 'Requires a Runnable subclass inside the target smali. Perfect for splash screen delays!',
      generate: (p) => {
        const ms = p.delay || '2000';
        return `# --- Injected Delay Action by NSMods PRO ---
    new-instance v0, Landroid/os/Handler;
    invoke-direct {v0}, Landroid/os/Handler;-><init>()V

    new-instance v1, Lcom/nsmods/dialog/simpledialog$1;
    invoke-direct {v1}, Lcom/nsmods/dialog/simpledialog$1;-><init>()V

    const-wide/th16 v2, ${ms}
    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z
# --- End of Delay Injection ---`;
      }
    },
    {
      id: 'device-id',
      name: 'Query Device Android ID',
      description: 'Retrieve unique device terminal identity code for hardware-bound authorization checks.',
      params: [],
      injectionGuide: 'Outputs Android ID string inside register v0. You can compare v0 with your admin string.',
      generate: () => {
        return `# --- Injected Device Android ID Query by NSMods PRO ---
    invoke-virtual {p0}, Landroid/content/Context;->getContentResolver()Landroid/content/ContentResolver;
    move-result-object v0

    const-string v1, "android_id"
    invoke-static {v0, v1}, Landroid/provider/Settings$Secure;->getString(Landroid/content/ContentResolver;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v0
    # Register v0 now holds the unique 16-character hex Android ID!
# --- End of Android ID Query ---`;
      }
    },
    {
      id: 'check-root',
      name: 'Check Root Privilege',
      description: 'Verify if the Android system is rooted or running custom superuser binaries.',
      params: [],
      injectionGuide: 'Sets register v0 to 1 if su files are present, else v0 will contain 0.',
      generate: () => {
        return `# --- Injected Root Status Check by NSMods PRO ---
    new-instance v0, Ljava/io/File;
    const-string v1, "/system/app/Superuser.apk"
    invoke-direct {v0, v1}, Ljava/io/File;-><init>(Ljava/lang/String;)V
    invoke-virtual {v0}, Ljava/io/File;->exists()Z
    move-result v0
    if-eqz v0, :cond_rooted

    new-instance v0, Ljava/io/File;
    const-string v1, "/system/xbin/su"
    invoke-direct {v0, v1}, Ljava/io/File;-><init>(Ljava/lang/String;)V
    invoke-virtual {v0}, Ljava/io/File;->exists()Z
    move-result v0
    if-eqz v0, :cond_rooted
    const/4 v0, 0x0
    goto :cond_out

    :cond_rooted
    const/4 v0, 0x1

    :cond_out
    # Register v0 contains 0x1 if rooted, 0x0 if unrooted!
# --- End of Root Check ---`;
      }
    }
  ];

  const activeSnippet = snippets.find(s => s.id === selectedSnippetId) || snippets[0];
  const generatedCode = activeSnippet.generate(inputs);

  const handleInputChange = (key: string, val: string) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
              Smali Snippet Generator <span className="text-[10px] py-0.5 px-2 bg-emerald-500/20 text-emerald-400 font-mono rounded-full font-semibold uppercase">PRO</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Generate ready-to-use Smali code snippets tailored for Android reverse engineering and modding.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel: Selector & Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Select Snippet Template</label>
            <div className="grid grid-cols-1 gap-2">
              {snippets.map((snip) => (
                <button
                  key={snip.id}
                  onClick={() => setSelectedSnippetId(snip.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    selectedSnippetId === snip.id
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-white'
                      : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:bg-slate-800/20 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${selectedSnippetId === snip.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-slate-500'}`}>
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{snip.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-light">{snip.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Inputs */}
          {activeSnippet.params.length > 0 && (
            <div className="p-5 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Customize Parameters
              </h3>
              <div className="space-y-4">
                {activeSnippet.params.map((param) => (
                  <div key={param.key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">{param.label}</label>
                    <input
                      type={param.type}
                      value={inputs[param.key] ?? param.defaultValue}
                      onChange={(e) => handleInputChange(param.key, e.target.value)}
                      placeholder={param.placeholder}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white font-mono focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Panel: Code Block & Guide */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Smali Output Codeblock */}
          <div className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden flex flex-col min-h-[250px]">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-slate-500 ml-2">generated_bytecode.smali</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg font-mono transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Smali</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-text bg-slate-950">
              {generatedCode}
            </div>
          </div>

          {/* Dynamic Injection Guide & Warning */}
          <div className="p-5 bg-indigo-950/20 border border-indigo-500/10 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-400" />
              Smali Injection Guide
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-400">
                <div className="p-1 bg-indigo-500/10 rounded text-indigo-400 mt-0.5">
                  <ArrowRight className="w-3 h-3" />
                </div>
                <p className="leading-relaxed font-light">{activeSnippet.injectionGuide}</p>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-amber-500/90 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-semibold text-amber-400 block mb-0.5">Register Safety Notice:</span>
                  <p className="text-[10px] text-slate-400 font-light leading-normal">
                    When injecting Smali instructions, verify that registers are allocated within the target method. If needed, increment the <span className="font-mono text-amber-400 bg-slate-950 px-1 rounded">.locals</span> directive at the top of the method.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
