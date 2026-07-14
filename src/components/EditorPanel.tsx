import React, { useRef, useState } from "react";
import { 
  User, Calendar, Ruler, Scale, Heart, MapPin, Home, Phone, 
  GraduationCap, Briefcase, Users, Plus, Trash2, RotateCcw, 
  Printer, FileCode, Upload, Palette, Sparkles, X, ChevronRight, Eye, LogOut, Save, Check
} from "lucide-react";
import { Biodata, QualificationItem, SiblingItem, ThemeConfig, AnimationPreset } from "../types";

interface EditorPanelProps {
  biodata: Biodata;
  setBiodata: React.Dispatch<React.SetStateAction<Biodata>>;
  themes: ThemeConfig[];
  activeTheme: ThemeConfig;
  setActiveTheme: (theme: ThemeConfig) => void;
  animations: AnimationPreset[];
  activeAnimation: AnimationPreset;
  setActiveAnimation: (anim: AnimationPreset) => void;
  onReset: () => void;
  onPrint: () => void;
  onLogout?: () => void;
  onSave?: () => void;
  saveStatus?: "idle" | "saving" | "saved";
}

export function EditorPanel({
  biodata,
  setBiodata,
  themes,
  activeTheme,
  setActiveTheme,
  animations,
  activeAnimation,
  setActiveAnimation,
  onReset,
  onPrint,
  onLogout,
  onSave,
  saveStatus = "idle"
}: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<"visuals" | "personal" | "education" | "family" | "photos">("visuals");
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Handler for generic nested state updates
  const updatePersonal = (field: keyof Biodata["personal"], value: any) => {
    setBiodata(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const updateProfession = (field: keyof Biodata["profession"], value: any) => {
    setBiodata(prev => ({
      ...prev,
      profession: {
        ...prev.profession,
        [field]: value
      }
    }));
  };

  const updateMaternal = (field: keyof Biodata["maternal"], value: any) => {
    setBiodata(prev => ({
      ...prev,
      maternal: {
        ...prev.maternal,
        [field]: value
      }
    }));
  };

  // List manipulation helpers for Hobbies & Languages
  const addArrayItem = (field: "languagesKnown" | "hobbies", item: string) => {
    if (!item.trim()) return;
    const currentList = biodata.personal[field];
    if (currentList.includes(item.trim())) return;
    updatePersonal(field, [...currentList, item.trim()]);
  };

  const removeArrayItem = (field: "languagesKnown" | "hobbies", index: number) => {
    const currentList = biodata.personal[field];
    updatePersonal(field, currentList.filter((_, i) => i !== index));
  };

  // Qualifications list manipulators
  const addQualification = () => {
    const newItem: QualificationItem = {
      category: "Graduation",
      degree: "New Degree / Certification",
      institution: "College / University Name"
    };
    setBiodata(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, newItem]
    }));
  };

  const updateQualification = (index: number, field: keyof QualificationItem, value: string) => {
    setBiodata(prev => {
      const updated = [...prev.qualifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, qualifications: updated };
    });
  };

  const removeQualification = (index: number) => {
    setBiodata(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  // Professional skills manipulation
  const addSkill = (skill: string) => {
    if (!skill.trim()) return;
    const current = biodata.profession.skills;
    if (current.includes(skill.trim())) return;
    updateProfession("skills", [...current, skill.trim()]);
  };

  const removeSkill = (index: number) => {
    updateProfession("skills", biodata.profession.skills.filter((_, i) => i !== index));
  };

  // Siblings list manipulators
  const addSibling = () => {
    const newItem: SiblingItem = {
      name: "Sibling Name",
      relation: "Brother",
      occupation: "Occupation Details",
      education: "Degree Details"
    };
    setBiodata(prev => ({
      ...prev,
      family: {
        ...prev.family,
        siblings: [...prev.family.siblings, newItem]
      }
    }));
  };

  const updateSibling = (index: number, field: keyof SiblingItem, value: string) => {
    setBiodata(prev => {
      const updatedSiblings = [...prev.family.siblings];
      updatedSiblings[index] = { ...updatedSiblings[index], [field]: value };
      return {
        ...prev,
        family: {
          ...prev.family,
          siblings: updatedSiblings
        }
      };
    });
  };

  const removeSibling = (index: number) => {
    setBiodata(prev => ({
      ...prev,
      family: {
        ...prev.family,
        siblings: prev.family.siblings.filter((_, i) => i !== index)
      }
    }));
  };

  // Handle Photo File Upload & conversion to base64
  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === "string") {
        const resultString = event.target.result;
        setBiodata(prev => {
          const updatedPhotos = [...prev.photos];
          updatedPhotos[index] = {
            ...updatedPhotos[index],
            url: resultString
          };
          return { ...prev, photos: updatedPhotos };
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const updatePhotoTitle = (index: number, title: string) => {
    setBiodata(prev => {
      const updatedPhotos = [...prev.photos];
      updatedPhotos[index] = { ...updatedPhotos[index], title };
      return { ...prev, photos: updatedPhotos };
    });
  };

  const updatePhotoCaption = (index: number, caption: string) => {
    setBiodata(prev => {
      const updatedPhotos = [...prev.photos];
      updatedPhotos[index] = { ...updatedPhotos[index], caption };
      return { ...prev, photos: updatedPhotos };
    });
  };

  // Export edited JSON
  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(biodata, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2500);
    });
  };

  // Helper lists for temporary input state
  const [newLanguage, setNewLanguage] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [newSkill, setNewSkill] = useState("");

  return (
    <div className="flex flex-col h-full bg-zinc-950/90 border-r border-zinc-800 text-zinc-100 flex-shrink-0 select-none">
      
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-sm tracking-wide text-white uppercase">
              Biodata Studio
            </h1>
            <p className="text-2xs font-mono text-zinc-500 uppercase">
              IT Student Customization Suite
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            title="Reset to Sample Data"
            className="p-1.5 rounded-md hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition duration-200"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out Admin"
              className="p-1.5 rounded-md hover:bg-red-950/40 hover:text-red-400 text-zinc-400 border border-transparent hover:border-red-900/30 transition duration-200"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Actions / Presets quick-bar */}
      <div className="p-3 bg-zinc-900/40 border-b border-zinc-800 flex gap-2 overflow-x-auto no-scrollbar">
        {onSave && (
          <button
            onClick={onSave}
            disabled={saveStatus === "saving"}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold transition duration-200 cursor-pointer flex-shrink-0 ${
              saveStatus === "saved"
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : saveStatus === "saving"
                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-400 text-black"
            }`}
          >
            {saveStatus === "saved" ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Save className={`w-3.5 h-3.5 ${saveStatus === "saving" ? "animate-pulse" : ""}`} />
            )}
            {saveStatus === "saved" ? "Saved!" : saveStatus === "saving" ? "Saving..." : "Save Details"}
          </button>
        )}
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium transition duration-200 cursor-pointer flex-shrink-0"
        >
          <Printer className="w-3.5 h-3.5 text-zinc-400" />
          Print / PDF
        </button>
        <button
          onClick={handleCopyJSON}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium transition duration-200 cursor-pointer flex-shrink-0"
        >
          <FileCode className="w-3.5 h-3.5 text-zinc-400" />
          {showCopyMessage ? "Copied!" : "Export JSON"}
        </button>
      </div>

      {/* Editor Sub-Tabs */}
      <div className="flex border-b border-zinc-800 text-xs">
        <button
          onClick={() => setActiveTab("visuals")}
          className={`flex-1 py-3 text-center border-b font-medium transition duration-200 cursor-pointer ${
            activeTab === "visuals" 
              ? "border-indigo-500 text-white bg-indigo-500/5" 
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Visuals
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex-1 py-3 text-center border-b font-medium transition duration-200 cursor-pointer ${
            activeTab === "personal" 
              ? "border-indigo-500 text-white bg-indigo-500/5" 
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Personal
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`flex-1 py-3 text-center border-b font-medium transition duration-200 cursor-pointer ${
            activeTab === "education" 
              ? "border-indigo-500 text-white bg-indigo-500/5" 
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Qualifications
        </button>
        <button
          onClick={() => setActiveTab("family")}
          className={`flex-1 py-3 text-center border-b font-medium transition duration-200 cursor-pointer ${
            activeTab === "family" 
              ? "border-indigo-500 text-white bg-indigo-500/5" 
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Family
        </button>
        <button
          onClick={() => setActiveTab("photos")}
          className={`flex-1 py-3 text-center border-b font-medium transition duration-200 cursor-pointer ${
            activeTab === "photos" 
              ? "border-indigo-500 text-white bg-indigo-500/5" 
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Photos
        </button>
      </div>

      {/* Tab Contents - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">

        {/* VISUALS & ANIMATIONS TAB */}
        {activeTab === "visuals" && (
          <div className="space-y-5 animate-fadeIn duration-200">
            <div>
              <label className="text-2xs font-mono text-zinc-500 uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
                <Palette className="w-3 h-3 text-indigo-400" /> Choose Accent Colorway
              </label>
              <div className="grid grid-cols-1 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition duration-200 cursor-pointer ${
                      activeTheme.id === theme.id 
                        ? "bg-zinc-900 border-zinc-700 ring-1 ring-zinc-600" 
                        : "bg-zinc-950/40 border-zinc-900/60 hover:bg-zinc-900/50 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3.5 h-3.5 rounded-full ${theme.activeBorder} bg-zinc-950 border border-white/10 flex items-center justify-center`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${theme.primaryClass.replace('text-', 'bg-')}`} />
                      </div>
                      <span className="text-xs font-medium text-zinc-200">{theme.name}</span>
                    </div>
                    <span className="text-3xs font-mono uppercase tracking-widest text-zinc-500">
                      Preset
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-2xs font-mono text-zinc-500 uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Scrolling Animation Effect
              </label>
              <div className="grid grid-cols-1 gap-2">
                {animations.map((anim) => (
                  <button
                    key={anim.id}
                    onClick={() => setActiveAnimation(anim)}
                    className={`p-3 rounded-lg border text-left transition duration-200 cursor-pointer block ${
                      activeAnimation.id === anim.id 
                        ? "bg-zinc-900 border-zinc-700 ring-1 ring-zinc-600" 
                        : "bg-zinc-950/40 border-zinc-900/60 hover:bg-zinc-900/50 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-zinc-200">{anim.name}</span>
                      <span className="text-3xs font-mono uppercase tracking-widest text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-950">
                        Preset
                      </span>
                    </div>
                    <p className="text-2xs text-zinc-400 leading-normal">{anim.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
              <span className="text-3xs font-mono uppercase tracking-widest text-indigo-400 block mb-1">Design Vibe: IT Scholar</span>
              <p className="text-2xs text-zinc-400 leading-normal">
                This custom theme represents tech scholars with sleek neon borders, high-contrast typography, and a refined dark interface. No cheesy retro green terminals — just pristine modern digital elegance.
              </p>
            </div>
          </div>
        )}

        {/* PERSONAL DETAILS TAB */}
        {activeTab === "personal" && (
          <div className="space-y-4 animate-fadeIn duration-200">
            <div>
              <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={biodata.personal.fullName}
                  onChange={(e) => updatePersonal("fullName", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition"
                  placeholder="Yashvi B. Vankadi"
                />
              </div>
            </div>

            <div>
              <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Intro / Description</label>
              <textarea
                value={biodata.personal.briefIntro}
                onChange={(e) => updatePersonal("briefIntro", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition resize-none leading-normal"
                placeholder="Brief intro details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={biodata.personal.dateOfBirth}
                    onChange={(e) => updatePersonal("dateOfBirth", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition"
                    placeholder="14th January 1999"
                  />
                </div>
              </div>
              <div>
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Caste</label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={biodata.personal.caste}
                    onChange={(e) => updatePersonal("caste", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition"
                    placeholder="Leuva Patel"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Height</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={biodata.personal.height}
                    onChange={(e) => updatePersonal("height", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition"
                    placeholder="5ft 2inchs"
                  />
                </div>
              </div>
              <div>
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Weight</label>
                <div className="relative">
                  <Scale className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={biodata.personal.weight}
                    onChange={(e) => updatePersonal("weight", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition"
                    placeholder="55 kgs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Native Place</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={biodata.personal.nativePlace}
                    onChange={(e) => updatePersonal("nativePlace", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition"
                    placeholder="Mandava, Botad"
                  />
                </div>
              </div>
              <div>
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Address</label>
                <div className="relative">
                  <Home className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={biodata.personal.address}
                    onChange={(e) => updatePersonal("address", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition"
                    placeholder="A-9, 202, Shanti Vihar..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Contact Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={biodata.personal.contactName}
                    onChange={(e) => updatePersonal("contactName", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition"
                    placeholder="Bakulbhai Vankadi"
                  />
                </div>
              </div>
              <div>
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={biodata.personal.contactPhone}
                    onChange={(e) => updatePersonal("contactPhone", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-700 transition"
                    placeholder="+91 93 244 90797"
                  />
                </div>
              </div>
            </div>

            {/* LANGUAGES KNOWN */}
            <div>
              <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Languages Known</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (addArrayItem("languagesKnown", newLanguage), setNewLanguage(""))}
                  className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                  placeholder="e.g. Hindi, French"
                />
                <button
                  onClick={() => { addArrayItem("languagesKnown", newLanguage); setNewLanguage(""); }}
                  className="px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {biodata.personal.languagesKnown.map((lang, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-3xs font-medium text-zinc-300">
                    {lang}
                    <button onClick={() => removeArrayItem("languagesKnown", idx)} className="text-zinc-500 hover:text-red-400 cursor-pointer">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* HOBBIES */}
            <div>
              <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Hobbies</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (addArrayItem("hobbies", newHobby), setNewHobby(""))}
                  className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                  placeholder="e.g. Hiking, Writing"
                />
                <button
                  onClick={() => { addArrayItem("hobbies", newHobby); setNewHobby(""); }}
                  className="px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {biodata.personal.hobbies.map((hb, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-3xs font-medium text-zinc-300">
                    {hb}
                    <button onClick={() => removeArrayItem("hobbies", idx)} className="text-zinc-500 hover:text-red-400 cursor-pointer">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EDUCATION & CAREER TAB */}
        {activeTab === "education" && (
          <div className="space-y-5 animate-fadeIn duration-200">
            
            {/* QUALIFICATIONS LIST */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-zinc-400" /> Academic Qualifications
                </label>
                <button
                  onClick={addQualification}
                  className="text-3xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {biodata.qualifications.map((qual, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded space-y-2 relative group">
                    <button
                      onClick={() => removeQualification(idx)}
                      className="absolute right-3 top-3 text-zinc-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={qual.category}
                        onChange={(e) => updateQualification(idx, "category", e.target.value as any)}
                        className="col-span-1 px-1 py-1 bg-zinc-950 border border-zinc-800 rounded text-3xs text-zinc-300 focus:outline-none"
                      >
                        <option value="Post Graduation">Post Grad</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Professional">Professional</option>
                        <option value="Schooling">Schooling</option>
                        <option value="Other">Other</option>
                      </select>

                      <input
                        type="text"
                        value={qual.degree}
                        onChange={(e) => updateQualification(idx, "degree", e.target.value)}
                        className="col-span-2 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                        placeholder="Degree/Course Name"
                      />
                    </div>

                    <input
                      type="text"
                      value={qual.institution || ""}
                      onChange={(e) => updateQualification(idx, "institution", e.target.value)}
                      className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-3xs text-zinc-300 focus:outline-none"
                      placeholder="University, College or School Name"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* CURRENT PROFESSION */}
            <div className="pt-4 border-t border-zinc-800/80">
              <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" /> Current Profession Details
              </label>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Role/Designation</label>
                    <input
                      type="text"
                      value={biodata.profession.currentRole}
                      onChange={(e) => updateProfession("currentRole", e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Company/Business</label>
                    <input
                      type="text"
                      value={biodata.profession.currentCompany}
                      onChange={(e) => updateProfession("currentCompany", e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="e.g. Madmix"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Former Role (Optional)</label>
                    <input
                      type="text"
                      value={biodata.profession.formerRole || ""}
                      onChange={(e) => updateProfession("formerRole", e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="e.g. Business Analyst"
                    />
                  </div>
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Former Company (Optional)</label>
                    <input
                      type="text"
                      value={biodata.profession.formerCompany || ""}
                      onChange={(e) => updateProfession("formerCompany", e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="e.g. Planet Paaduks"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* FAMILY & MATERNAL TAB */}
        {activeTab === "family" && (
          <div className="space-y-4 animate-fadeIn duration-200">
            
            {/* IMMEDIATE FAMILY */}
            <div>
              <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-400" /> Father & Mother Details
              </label>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Father's Name</label>
                    <input
                      type="text"
                      value={biodata.family.fatherName}
                      onChange={(e) => setBiodata(prev => ({
                        ...prev,
                        family: { ...prev.family, fatherName: e.target.value }
                      }))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="Bakulbhai Mohanbhai Vankadi"
                    />
                  </div>
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Father's Occupation</label>
                    <input
                      type="text"
                      value={biodata.family.fatherOccupation}
                      onChange={(e) => setBiodata(prev => ({
                        ...prev,
                        family: { ...prev.family, fatherOccupation: e.target.value }
                      }))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="Diamond Broker"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Mother's Name</label>
                    <input
                      type="text"
                      value={biodata.family.motherName}
                      onChange={(e) => setBiodata(prev => ({
                        ...prev,
                        family: { ...prev.family, motherName: e.target.value }
                      }))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="Sonalben Bakulbhai Vankadi"
                    />
                  </div>
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Mother's Occupation</label>
                    <input
                      type="text"
                      value={biodata.family.motherOccupation}
                      onChange={(e) => setBiodata(prev => ({
                        ...prev,
                        family: { ...prev.family, motherOccupation: e.target.value }
                      }))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="Tutor"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SIBLINGS LIST */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider">
                  Siblings Details
                </label>
                <button
                  onClick={addSibling}
                  className="text-3xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Sibling
                </button>
              </div>

              <div className="space-y-3">
                {biodata.family.siblings.map((sib, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded space-y-2 relative">
                    <button
                      onClick={() => removeSibling(idx)}
                      className="absolute right-3 top-3 text-zinc-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={sib.relation}
                        onChange={(e) => updateSibling(idx, "relation", e.target.value as any)}
                        className="col-span-1 px-1 py-1 bg-zinc-950 border border-zinc-800 rounded text-3xs text-zinc-300 focus:outline-none"
                      >
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                      </select>

                      <input
                        type="text"
                        value={sib.name}
                        onChange={(e) => updateSibling(idx, "name", e.target.value)}
                        className="col-span-2 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                        placeholder="Sibling's Name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={sib.occupation}
                        onChange={(e) => updateSibling(idx, "occupation", e.target.value)}
                        className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-3xs text-zinc-300 focus:outline-none"
                        placeholder="Occupation"
                      />
                      <input
                        type="text"
                        value={sib.education || ""}
                        onChange={(e) => updateSibling(idx, "education", e.target.value)}
                        className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-3xs text-zinc-300 focus:outline-none"
                        placeholder="Education / Degree"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MATERNAL DETAILS */}
            <div>
              <label className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                Maternal (Nani-Paksh) Details
              </label>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded space-y-2">
                <div>
                  <label className="text-4xs font-mono text-zinc-500 uppercase">Maternal Grandfather</label>
                  <input
                    type="text"
                    value={biodata.maternal.grandfatherName}
                    onChange={(e) => updateMaternal("grandfatherName", e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                    placeholder="Bhimjibhai Talsibhai Gabani"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Nani's Native Place</label>
                    <input
                      type="text"
                      value={biodata.maternal.nativePlace}
                      onChange={(e) => updateMaternal("nativePlace", e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="Alampar, Umrala"
                    />
                  </div>
                  <div>
                    <label className="text-4xs font-mono text-zinc-500 uppercase">Maternal Uncle (Mama)</label>
                    <input
                      type="text"
                      value={biodata.maternal.uncleName}
                      onChange={(e) => updateMaternal("uncleName", e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="Malkeshbhai Gabani"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-4xs font-mono text-zinc-500 uppercase">Uncle's Occupation (Optional)</label>
                  <input
                    type="text"
                    value={biodata.maternal.uncleOccupation || ""}
                    onChange={(e) => updateMaternal("uncleOccupation", e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                    placeholder="e.g. Business Owner (Mumbai)"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHOTOS UPLOAD & CAPTIONS TAB */}
        {activeTab === "photos" && (
          <div className="space-y-4 animate-fadeIn duration-200">
            <span className="text-3xs font-mono text-zinc-500 uppercase tracking-wider block">
              Manage 4 Portfolio Photo Slots
            </span>
            
            {biodata.photos.map((photo, index) => (
              <div key={photo.id} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-18 rounded border border-zinc-800 bg-zinc-950 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                    {photo.url ? (
                      <img 
                        src={photo.url} 
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-2xs text-zinc-600 font-mono">No Pic</span>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-mono text-indigo-400 font-semibold">
                        Photo Slot {index + 1}
                      </span>
                      <button
                        onClick={() => fileInputRefs[index].current?.click()}
                        className="text-4xs flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 font-mono uppercase text-zinc-300 hover:text-white cursor-pointer transition"
                      >
                        <Upload className="w-2.5 h-2.5" /> Upload File
                      </button>
                      <input
                        type="file"
                        ref={fileInputRefs[index]}
                        onChange={(e) => handlePhotoUpload(index, e)}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    
                    <input
                      type="text"
                      value={photo.title}
                      onChange={(e) => updatePhotoTitle(index, e.target.value)}
                      className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-3xs text-white focus:outline-none"
                      placeholder="Photo Role / title (e.g. Primary Portrait)"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) => updatePhotoCaption(index, e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-3xs text-zinc-400 focus:outline-none"
                  placeholder="Caption detailing location, context or vibe..."
                />
              </div>
            ))}
            
            <div className="p-3.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-2xs text-zinc-400">
              <p className="leading-normal">
                💡 **Pro-Tip**: You can select any local `.jpg` or `.png` files from your device. They will be encoded into secure base64 strings and previewed live on the scrolling website instantly!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="p-3 border-t border-zinc-900 text-center bg-zinc-950/40">
        <p className="text-4xs font-mono text-zinc-600 tracking-wider">
          interactive engine &copy; 2026 • built for academic showcase
        </p>
      </div>

    </div>
  );
}
