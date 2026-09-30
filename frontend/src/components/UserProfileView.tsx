import React, { useState } from 'react';
import { 
  User, 
  Key, 
  ShieldAlert, 
  Camera, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  CreditCard,
  Laptop,
  Globe,
  Lock,
  Save,
  Trash2,
  AlertTriangle,
  LogOut,
  Monitor,
  Clock,
  MapPin,
  Languages,
  Check
} from 'lucide-react';

interface UserProfileViewProps {
  darkMode?: boolean;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ darkMode = true }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'personal' | 'devices' | 'language'>('account');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  // Account Information States
  const [email, setEmail] = useState<string>('jeffersonlee1234@gmail.com');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [passSaveMsg, setPassSaveMsg] = useState<string | null>(null);

  // Personal Information States
  const [firstName, setFirstName] = useState<string>('JEFFERSON');
  const [middleName, setMiddleName] = useState<string>('FERNANDO');
  const [lastName, setLastName] = useState<string>('LEE');
  const [suffix, setSuffix] = useState<string>('');

  const [birthMonth, setBirthMonth] = useState<string>('SEPTEMBER');
  const [birthDay, setBirthDay] = useState<string>('27');
  const [birthYear, setBirthYear] = useState<string>('2004');
  const [bloodType, setBloodType] = useState<string>('O+');

  const [city, setCity] = useState<string>('QUEZON CITY');
  const [houseNo, setHouseNo] = useState<string>('176');
  const [street, setStreet] = useState<string>('23');
  const [barangay, setBarangay] = useState<string>('BAGONG SILANGAN');

  const [workingInQC, setWorkingInQC] = useState<string>('Yes');
  const [occupation, setOccupation] = useState<string>('IT SUPPORT');
  const [sex, setSex] = useState<string>('Male');
  const [mobileNumber, setMobileNumber] = useState<string>('09155582122');

  const [showQcidModal, setShowQcidModal] = useState<boolean>(false);
  const [savePersonalMsg, setSavePersonalMsg] = useState<string | null>(null);

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPassSaveMsg('Password successfully updated!');
    setTimeout(() => setPassSaveMsg(null), 3000);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePersonalSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavePersonalMsg('Personal information updated successfully!');
    setTimeout(() => setSavePersonalMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300 pb-12">
      {/* Main Profile Header Box (Matching Screenshots 1 to 5) */}
      <div className={`rounded-2xl border shadow-2xl overflow-hidden ${
        darkMode ? 'bg-[#0b1426] border-slate-800' : 'bg-white border-slate-200 shadow-slate-200/50'
      }`}>
        
        {/* Header Title Section */}
        <div className={`p-6 border-b ${darkMode ? 'bg-[#0e1933] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Hi, JEFFERSON FERNANDO LEE!
              </h2>
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-blue-500/50 text-slate-300 flex items-center justify-center font-bold text-lg shadow-inner">
                <User className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">JEFFERSON FERNANDO LEE</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status:</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold rounded-full">
                    Active
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="ml-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Camera className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Upload Photo</span>
              </button>
            </div>
          </div>

          {/* Profile Navigation Tabs (Matching exact screenshots) */}
          <div className="flex border-b border-slate-800 mt-6 overflow-x-auto gap-2">
            {[
              { id: 'account', label: 'Account Information' },
              { id: 'personal', label: 'Personal Information' },
              { id: 'devices', label: 'Devices & History' },
              { id: 'language', label: 'Language' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-5 text-xs font-extrabold transition-all border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-blue-500 text-blue-400 bg-blue-950/30'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 space-y-8">
          {activeTab === 'account' ? (
            /* TAB 1: ACCOUNT INFORMATION */
            <div className="space-y-8 max-w-3xl mx-auto">
              
              {/* Section 1: Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0e1933] border border-slate-700/80 rounded-xl text-xs text-white font-mono"
                />
              </div>

              {/* Section 2: Change Password Box */}
              <form onSubmit={handlePasswordSave} className="p-6 bg-[#0c162b] border border-slate-800 rounded-2xl space-y-5 shadow-lg">
                <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-3">
                  <Key className="w-4 h-4" />
                  <h3 className="text-sm font-extrabold text-white">Change Password</h3>
                </div>

                {passSaveMsg && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{passSaveMsg}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 bg-[#091122] border border-slate-700 rounded-xl text-xs text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full px-4 py-3 bg-[#091122] border border-slate-700 rounded-xl text-xs text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full px-4 py-3 bg-[#091122] border border-slate-700 rounded-xl text-xs text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl border border-blue-400/30 flex items-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Save New Password</span>
                  </button>
                </div>
              </form>

              {/* Section 3: Danger Zone Box (Matching Screenshots 1 & 2) */}
              <div className="p-6 bg-red-950/20 border border-red-900/60 rounded-2xl space-y-4 shadow-lg">
                <div className="flex items-center gap-2 text-red-500 font-extrabold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Danger Zone</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deactivating your account is a permanent action. All your data will be removed and you will lose access to the portal.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => alert('Account deactivation link requested.')}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
                  >
                    Deactivate Account
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Account deletion confirmation sent to email.')}
                    className="px-6 py-2.5 border border-red-600 text-red-400 hover:bg-red-950/40 font-bold text-xs rounded-xl transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'personal' ? (
            /* TAB 2: PERSONAL INFORMATION (Matching Screenshots 3, 4, 5) */
            <form onSubmit={handlePersonalSave} className="space-y-8 max-w-4xl mx-auto">
              
              {savePersonalMsg && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{savePersonalMsg}</span>
                </div>
              )}

              {/* Section 1: Full Name */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Full Name</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Middle Name (Optional)</label>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Suffix</label>
                    <input
                      type="text"
                      value={suffix}
                      onChange={(e) => setSuffix(e.target.value)}
                      placeholder="e.g. JR"
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Birth Date & Blood Type */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Birth Date</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Month</label>
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white uppercase"
                    >
                      {['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Day</label>
                    <input
                      type="text"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Year</label>
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white"
                    >
                      {Array.from({ length: 70 }, (_, i) => 2026 - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Blood Type</label>
                    <input
                      type="text"
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Address */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">House No.</label>
                    <input
                      type="text"
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Street</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Barangay</label>
                    <input
                      type="text"
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Employment Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Employment Details</h3>
                
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 block">Are you working in Quezon City?</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="workingQC"
                        value="Yes"
                        checked={workingInQC === 'Yes'}
                        onChange={(e) => setWorkingInQC(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="workingQC"
                        value="No"
                        checked={workingInQC === 'No'}
                        onChange={(e) => setWorkingInQC(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 block">Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white uppercase"
                  />
                </div>
              </div>

              {/* Section 5: Sex & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 block">Sex</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 block">Mobile Number</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0e1933] border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Centered Edit Profile Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all"
                >
                  Edit Profile
                </button>
              </div>

              {/* Danger Zone Box at Bottom */}
              <div className="p-6 bg-red-950/20 border border-red-900/60 rounded-2xl space-y-4 shadow-lg">
                <div className="flex items-center gap-2 text-red-500 font-extrabold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Danger Zone</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deactivating your account is a permanent action. All your data will be removed and you will lose access to the portal.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => alert('Account deactivation requested.')}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
                  >
                    Deactivate Account
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Account deletion requested.')}
                    className="px-6 py-2.5 border border-red-600 text-red-400 hover:bg-red-950/40 font-bold text-xs rounded-xl transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === 'devices' ? (
            /* TAB 3: DEVICES & HISTORY (Matching Screenshot 1) */
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-extrabold text-white">Device Management & Login History</h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Logged out of all other devices.')}
                  className="px-3.5 py-1.5 border border-red-800/80 hover:bg-red-950/40 text-red-400 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out All Other Devices</span>
                </button>
              </div>

              {/* Active Current Device Card */}
              <div className="p-5 bg-[#0e1933] border border-slate-800 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 border border-blue-400/40 text-white flex items-center justify-center shrink-0">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-extrabold text-white">Windows PC • Google Chrome</span>
                        <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Active Now
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        OS: <strong className="text-slate-200">Windows</strong> • Browser: <strong className="text-slate-200">Google Chrome</strong> • IP: <strong className="text-slate-200">120.28.144.151</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert('Device session logged out.')}
                    className="px-3.5 py-1.5 border border-red-800/80 hover:bg-red-950/40 text-red-400 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all self-start sm:self-auto"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out Device</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Signed in: <strong className="text-slate-200 font-normal">Sep 29, 2026, 9:10:45 AM</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: <strong className="text-slate-200 font-normal">Quezon City, PH</strong></span>
                  </div>
                </div>
              </div>

              {/* Sub-section: OTHER DEVICES & LOGIN HISTORY */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  OTHER DEVICES & LOGIN HISTORY
                </h4>
                <div className="p-8 border-2 border-dashed border-slate-800/80 rounded-2xl text-center text-xs text-slate-500">
                  No other login history recorded.
                </div>
              </div>

              {/* Danger Zone Box */}
              <div className="p-6 bg-red-950/20 border border-red-900/60 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-red-500 font-extrabold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Danger Zone</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deactivating your account is a permanent action. All your data will be removed and you will lose access to the portal.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => alert('Account deactivation requested.')}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
                  >
                    Deactivate Account
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Account deletion requested.')}
                    className="px-6 py-2.5 border border-red-600 text-red-400 hover:bg-red-950/40 font-bold text-xs rounded-xl transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 4: LANGUAGE (Matching Screenshot 2) */
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="space-y-1 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white">
                  <Languages className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-extrabold">Language</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Choose the language used across the portal.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'English', label: 'English' },
                  { id: 'Tagalog', label: 'Tagalog' },
                ].map((lang) => {
                  const isSelected = selectedLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`w-full p-4 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#0f1c38] border-blue-500 text-blue-300 ring-1 ring-blue-500/50'
                          : 'bg-[#091122] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Danger Zone Box */}
              <div className="p-6 bg-red-950/20 border border-red-900/60 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-red-500 font-extrabold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Danger Zone</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deactivating your account is a permanent action. All your data will be removed and you will lose access to the portal.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => alert('Account deactivation requested.')}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
                  >
                    Deactivate Account
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Account deletion requested.')}
                    className="px-6 py-2.5 border border-red-600 text-red-400 hover:bg-red-950/40 font-bold text-xs rounded-xl transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QCID Digital Card Modal */}
      {showQcidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0e172a] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                Quezon City Digital Resident Identification (QCID)
              </h3>
              <button onClick={() => setShowQcidModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 border border-blue-500/50 rounded-2xl text-left space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold text-blue-300 uppercase tracking-widest">QUEZON CITY RESIDENT ID</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase">VERIFIED</span>
              </div>
              <div className="space-y-1">
                <span className="text-lg font-black text-white block">JEFFERSON FERNANDO LEE</span>
                <span className="text-xs font-mono text-amber-300 font-bold">QCID No: 9842-1049-4143</span>
              </div>
              <div className="pt-2 flex justify-between items-end text-[11px] text-slate-300 border-t border-blue-800/60">
                <div>
                  <span className="block text-[9px] text-slate-400">BARANGAY</span>
                  <span className="font-semibold">BAGONG SILANGAN</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400">VALID UNTIL</span>
                  <span className="font-semibold">SEP 2030</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowQcidModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
            >
              Close QCID Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
