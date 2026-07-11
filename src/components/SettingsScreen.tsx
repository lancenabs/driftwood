import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  Copy, 
  Check, 
  RefreshCw, 
  Smartphone, 
  Users, 
  Lock, 
  Shield, 
  Wifi, 
  CheckCircle,
  Plus,
  Trash2,
  Info,
  Server,
  Zap,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsScreenProps {
  onBack: () => void;
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: string;
  role: string;
  status: 'online' | 'offline' | 'syncing';
  lastSeen: string;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  // Family Code states
  const [familyCode, setFamilyCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('familyframe_family_code_v1');
      if (saved) return saved;
    } catch {}
    return "FAM-492-Z8X";
  });

  const [familyUnitName, setFamilyUnitName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('familyframe_family_unit_name_v1');
      if (saved) return saved;
    } catch {}
    return "The Miller Family Frame";
  });

  const [inputCode, setInputCode] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [joinStatus, setJoinStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [joinMessage, setJoinMessage] = useState("");

  // Sync states
  const [syncState, setSyncState] = useState<'synchronized' | 'syncing' | 'error'>('synchronized');
  const [lastSyncText, setLastSyncText] = useState("Just now");
  const [bgAutoSync, setBgAutoSync] = useState(true);
  const [therapistLiveSync, setTherapistLiveSync] = useState(true);

  // Connected Devices states
  const [devices, setDevices] = useState<ConnectedDevice[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_connected_devices_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', name: "Alex's iPhone 15", type: 'phone', role: 'Partner A (Host)', status: 'online', lastSeen: 'Active now' },
      { id: '2', name: "Taylor's Galaxy S24", type: 'phone', role: 'Partner B', status: 'online', lastSeen: 'Synced 1m ago' },
      { id: '3', name: "Dr. Evelyn's MacBook", type: 'laptop', role: 'Therapist (B2B Portal)', status: 'online', lastSeen: 'Active 2m ago' }
    ];
  });

  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceRole, setNewDeviceRole] = useState("Partner");
  const [showAddDevice, setShowAddDevice] = useState(false);

  // Save state helpers
  useEffect(() => {
    try {
      localStorage.setItem('familyframe_family_code_v1', familyCode);
      localStorage.setItem('familyframe_family_unit_name_v1', familyUnitName);
      localStorage.setItem('familyframe_connected_devices_v1', JSON.stringify(devices));
    } catch {}
  }, [familyCode, familyUnitName, devices]);

  // Simulate Force Sync
  const handleForceSync = () => {
    if (syncState === 'syncing') return;
    setSyncState('syncing');
    setLastSyncText("Synchronizing data...");

    // Update devices to 'syncing' status temporarily
    setDevices(prev => prev.map(d => d.status === 'online' ? { ...d, status: 'syncing' } : d));

    setTimeout(() => {
      setSyncState('synchronized');
      setLastSyncText("Just now");
      // Revert devices back to 'online' status
      setDevices(prev => prev.map(d => d.status === 'syncing' ? { ...d, status: 'online', lastSeen: 'Synced just now' } : d));
      
      // Toast / Notification trigger simulated
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#58CC02] text-white font-display font-black text-[10px] px-4 py-2.5 rounded-full shadow-lg border-2 border-[#46A302] tracking-wider uppercase z-50 animate-bounce';
      toast.innerText = '✨ UNIT CO-OP DATABASE SYNCHRONIZED';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 2500);
    }, 1500);
  };

  // Copy Family Code to Clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(familyCode);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  // Generate a New Random Family Code
  const handleGenerateNewCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'FAM-';
      for (let i = 0; i < 3; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      code += '-';
      for (let i = 0; i < 3; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      
      setFamilyCode(code);
      setIsGenerating(false);
    }, 800);
  };

  // Join simulated Family Code
  const handleJoinCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setJoinStatus('verifying');
    setJoinMessage("Contacting server unit... Validating token...");

    setTimeout(() => {
      const cleanCode = inputCode.trim().toUpperCase();
      if (cleanCode.length < 5) {
        setJoinStatus('error');
        setJoinMessage("Invalid format. Family codes require at least 5 alphanumeric characters.");
        return;
      }

      setJoinStatus('success');
      setJoinMessage(`Joined the family unit — same shore, same fire.`);
      setFamilyCode(cleanCode);
      setFamilyUnitName(`Central Unit (${cleanCode})`);

      // Add a simulated companion device automatically
      const newCompanion: ConnectedDevice = {
        id: Date.now().toString(),
        name: `Companion Active Node (${cleanCode})`,
        type: 'phone',
        role: 'Co-op Peer',
        status: 'online',
        lastSeen: 'Active now'
      };
      setDevices(prev => [newCompanion, ...prev]);
      setInputCode("");
    }, 1800);
  };

  // Simulate manual device additions
  const handleAddDeviceDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    const newDev: ConnectedDevice = {
      id: Date.now().toString(),
      name: newDeviceName.trim(),
      type: 'phone',
      role: newDeviceRole,
      status: 'online',
      lastSeen: 'Connected just now'
    };

    setDevices(prev => [...prev, newDev]);
    setNewDeviceName("");
    setShowAddDevice(false);
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="flex flex-col gap-5 py-2 w-full max-w-md mx-auto text-on-background animate-fade-in-up">
      {/* Top Navigation Row */}
      <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-[2rem] border-2 border-outline-variant shadow-sm">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-slate-100 border border-outline-variant hover:bg-slate-200 transition-colors flex items-center justify-center text-on-surface cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <div>
          <h2 className="font-display font-black text-sm text-on-surface flex items-center gap-1">
            <Settings className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '8s' }} />
            <span>Family Settings</span>
          </h2>
          <p className="font-sans text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Device Synchronization Hub</p>
        </div>
      </div>

      {/* Real-time Connection Synchronization Status Indicator Panel */}
      <section className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-on-surface-variant tracking-wider">Synchronization Engine</span>
            <div className="flex items-center gap-2 mt-1">
              {syncState === 'syncing' ? (
                <div className="w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              )}
              <span className={`font-display font-black text-xs uppercase tracking-wider ${syncState === 'syncing' ? 'text-amber-500' : 'text-green-600'}`}>
                {syncState === 'syncing' ? 'CONNECTING & SYNCING...' : 'ONLINE & SYNCHRONIZED'}
              </span>
            </div>
            <p className="font-sans text-[10px] text-on-surface-variant mt-1">
              Active Server Connection: <span className="font-mono text-primary font-bold">us-west2-firestore-socket</span>
            </p>
          </div>

          <button
            onClick={handleForceSync}
            disabled={syncState === 'syncing'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border-b-4 transition-all duration-200 cursor-pointer ${
              syncState === 'syncing' 
                ? 'bg-slate-100 border-slate-200 text-slate-400' 
                : 'bg-[#1CB0F6] text-white border-[#1899D6] hover:brightness-105 active:translate-y-[2px] active:border-b-2 shadow-3d-secondary'
            }`}
            title="Force Sync Databases Now"
          >
            <RefreshCw className={`w-4 h-4 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Sync Info Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-outline-variant/60">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase text-on-surface-variant tracking-wider">Last Synced</span>
            <span className="text-xs font-black text-[#4B4B4B] mt-1 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#58CC02]" />
              {lastSyncText}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase text-on-surface-variant tracking-wider">Connected Nodes</span>
            <span className="text-xs font-black text-[#4B4B4B] mt-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-secondary" />
              <span>{devices.length} Devices Linked</span>
            </span>
          </div>
        </div>

        {/* Synchronization Settings Toggles */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-150 cursor-pointer hover:bg-slate-100/50 transition-colors">
            <div className="flex flex-col pr-4">
              <span className="text-[10.5px] font-bold text-[#4B4B4B] flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-primary" />
                <span>Background Auto-Sync</span>
              </span>
              <span className="text-[8.5px] text-on-surface-variant">Simulate persistent real-time socket handshakes.</span>
            </div>
            <input 
              type="checkbox"
              checked={bgAutoSync}
              onChange={(e) => setBgAutoSync(e.target.checked)}
              className="w-4 h-4 rounded border-outline text-primary focus:ring-primary cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-150 cursor-pointer hover:bg-slate-100/50 transition-colors">
            <div className="flex flex-col pr-4">
              <span className="text-[10.5px] font-bold text-[#4B4B4B] flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-secondary" />
                <span>Therapist Live Portal Access</span>
              </span>
              <span className="text-[8.5px] text-on-surface-variant">Allow therapist real-time progress & alignment telemetry.</span>
            </div>
            <input 
              type="checkbox"
              checked={therapistLiveSync}
              onChange={(e) => setTherapistLiveSync(e.target.checked)}
              className="w-4 h-4 rounded border-outline text-secondary focus:ring-secondary cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* Family Code Sharing and Joining Section */}
      <section className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-4">
        <div>
          <span className="text-[9px] font-black uppercase text-on-surface-variant tracking-wider">Co-op Shared Unit</span>
          <h3 className="font-display font-black text-sm text-[#4B4B4B] mt-0.5">{familyUnitName}</h3>
          <p className="font-sans text-[10px] text-on-surface-variant mt-1 leading-relaxed">
            Invite your spouse, children, or family therapist. Anyone who joins this code is instantly linked into the same sandbox de-escalation gym & shared calendar!
          </p>
        </div>

        {/* Display Current Family Code with Share Controls */}
        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex flex-col items-center justify-center gap-3 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Server className="w-20 h-20 text-primary" />
          </div>

          <span className="text-[9px] font-black uppercase text-primary tracking-widest">Active Family Code</span>
          <div className="font-mono font-extrabold text-2xl text-primary tracking-wider bg-white px-5 py-2 rounded-xl border-2 border-primary/20 shadow-sm relative group">
            {familyCode}
          </div>

          <div className="flex gap-2 w-full">
            <button
              onClick={handleCopyCode}
              disabled={isCopying}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-b-[3px] font-display font-black text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
                isCopying 
                  ? 'bg-green-500 border-green-700 text-white' 
                  : 'bg-white border-outline-variant hover:bg-slate-50 text-[#4B4B4B] active:translate-y-[1px]'
              }`}
            >
              {isCopying ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopying ? 'COPIED!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleGenerateNewCode}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-white py-2 px-3 rounded-xl border-b-[3px] border-secondary-dark font-display font-black text-[10px] uppercase tracking-wider hover:brightness-105 active:translate-y-[1px] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Enter Code form to Join another Unit */}
        <form onSubmit={handleJoinCode} className="border-t border-slate-100 pt-4 flex flex-col gap-2.5 text-on-surface">
          <label className="text-[8.5px] font-black uppercase tracking-wider text-on-surface-variant block">
            Join another Family Unit or Therapist Session
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g. FAM-123-ABC"
              className="flex-1 bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-mono font-bold uppercase placeholder-slate-400 text-[#4B4B4B]"
            />
            <button
              type="submit"
              disabled={joinStatus === 'verifying'}
              className="bg-[#58CC02] text-white px-4 py-2 rounded-xl border-b-[3px] border-[#46A302] font-display font-black text-[10px] uppercase tracking-wider hover:brightness-105 active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Connect</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {joinStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`p-2.5 rounded-xl text-[10px] leading-relaxed font-sans font-semibold border ${
                  joinStatus === 'verifying' ? 'bg-primary/5 text-primary border-primary/10' :
                  joinStatus === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                  'bg-red-50 text-red-600 border-red-200'
                }`}
              >
                {joinStatus === 'verifying' && (
                  <div className="flex items-center gap-1.5 font-bold">
                    <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                    <span>{joinMessage}</span>
                  </div>
                )}
                {joinStatus === 'success' && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{joinMessage}</span>
                  </div>
                )}
                {joinStatus === 'error' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-500 text-xs font-bold">⚠️</span>
                    <span>{joinMessage}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </section>

      {/* Linked Devices & Family Node Registry */}
      <section className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B]">Linked Devices ({devices.length})</span>
          </div>
          
          <button
            type="button"
            onClick={() => setShowAddDevice(!showAddDevice)}
            className="text-[9px] font-black bg-primary/10 text-primary hover:bg-primary/15 px-2.5 py-1.5 rounded-xl border border-primary/20 uppercase tracking-widest transition-all cursor-pointer"
          >
            {showAddDevice ? 'Cancel' : 'Add Node'}
          </button>
        </div>

        {/* Add Device form */}
        {showAddDevice && (
          <form onSubmit={handleAddDeviceDirect} className="bg-slate-50 p-3.5 rounded-2xl border-2 border-outline-variant flex flex-col gap-3 animate-fade-in text-on-surface">
            <span className="text-[8px] font-black uppercase text-on-surface-variant tracking-wider block">Add Mock Connected Device</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                placeholder="Device (e.g. Kid's iPad)"
                className="w-full bg-white text-[10px] px-2.5 py-1.5 rounded-lg border-2 border-outline-variant focus:outline-none focus:border-primary font-bold text-[#4B4B4B]"
              />
              <select
                value={newDeviceRole}
                onChange={(e) => setNewDeviceRole(e.target.value)}
                className="w-full bg-white text-[10px] px-2.5 py-1.5 rounded-lg border-2 border-outline-variant focus:outline-none focus:border-primary font-bold text-[#4B4B4B]"
              >
                <option value="Partner A">Partner A</option>
                <option value="Partner B">Partner B</option>
                <option value="Child/Teenager">Child/Teenager</option>
                <option value="Therapist">Therapist</option>
                <option value="Shared Tablet">Shared Tablet</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-primary text-white text-[10px] font-black uppercase tracking-wider py-1.5 rounded-lg border-b-2 border-primary-dark cursor-pointer text-center"
            >
              Link Node Device
            </button>
          </form>
        )}

        {/* List representation of active linked devices */}
        <div className="flex flex-col gap-2">
          {devices.map((device) => (
            <div 
              key={device.id} 
              className="flex justify-between items-center p-2.5 rounded-xl border-2 border-outline-variant bg-white hover:border-primary/40 transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10.5px] font-bold text-[#4B4B4B] truncate">{device.name}</span>
                    <span className="text-[7.5px] bg-slate-100 text-on-surface-variant px-1.5 py-0.5 rounded font-black uppercase tracking-wider">{device.role}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {device.status === 'syncing' ? (
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    ) : device.status === 'online' ? (
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    )}
                    <span className="text-[8.5px] font-mono text-on-surface-variant font-bold">
                      {device.status === 'syncing' ? 'Syncing...' : device.lastSeen}
                    </span>
                  </div>
                </div>
              </div>

              {/* Remove device simulation only for non-hosts */}
              {!device.role.includes('Host') && (
                <button
                  type="button"
                  onClick={() => handleDeleteDevice(device.id)}
                  className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all cursor-pointer"
                  title="Remove Device Sync Link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Clinical Sandbox footer */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex gap-2 items-start text-[10px] leading-relaxed text-[#4B4B4B]">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="font-sans">
            <strong>Therapeutic Alignment Model:</strong> FamilyFrame uses a decentralized clinical database design. Once linked, Partner A, Partner B, and any therapeutic nodes receive real-time, zero-latency pushes of de-escalation records, joint alignment calendars, and habits logs.
          </p>
        </div>
      </section>
    </div>
  );
}
