"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Lock, Save, Plus, Trash2, FileUp, 
  ChevronRight, BookOpen, Briefcase, Award, CheckCircle, 
  Settings, LogOut, Code, AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"cv" | "skills" | "projects" | "blog" | "education">("cv");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Dynamic content state
  const [dbData, setDbData] = useState<any>(null);
  
  // CV Upload state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);

  // Form states for adding items
  const [newSkill, setNewSkill] = useState({ category: "security", name: "", level: 80 });
  const [newProject, setNewProject] = useState({
    id: "",
    category: "security",
    title: { fr: "", en: "" },
    desc: { fr: "", en: "" },
    techs: "",
    githubUrl: "",
    liveUrl: ""
  });
  const [newBlogPost, setNewBlogPost] = useState({
    id: "",
    category: "cyber",
    date: new Date().toISOString().split("T")[0],
    author: "Koladé",
    title: { fr: "", en: "" },
    desc: { fr: "", en: "" },
    content: { fr: "", en: "" }
  });
  const [newEdu, setNewEdu] = useState({
    year: { fr: "", en: "" },
    school: { fr: "", en: "" },
    degree: { fr: "", en: "" },
    desc: { fr: "", en: "" }
  });

  // Load passcode from localStorage on mount
  useEffect(() => {
    const savedPass = localStorage.getItem("soc_admin_pass");
    if (savedPass) {
      setPassword(savedPass);
      verifyAccess(savedPass);
    }
  }, []);

  const verifyAccess = async (pass: string) => {
    try {
      const res = await fetch("/api/portfolio/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass })
      });
      if (res.ok) {
        localStorage.setItem("soc_admin_pass", pass);
        setIsAuthorized(true);
        setErrorMsg("");
        fetchData();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Mot de passe incorrect.");
      }
    } catch (err) {
      setErrorMsg("Erreur lors de la connexion aux APIs.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Veuillez saisir la phrase secrète.");
      return;
    }
    verifyAccess(password);
  };

  const handleLogout = () => {
    localStorage.removeItem("soc_admin_pass");
    setIsAuthorized(false);
    setPassword("");
    setDbData(null);
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/portfolio/content");
      const data = await res.json();
      setDbData(data);
    } catch (err) {
      setErrorMsg("Impossible de récupérer la base de données.");
    }
  };

  const triggerNotification = (type: "success" | "error", msg: string) => {
    if (type === "success") {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  // Save changes to API
  const saveDatabase = async (updatedData = dbData) => {
    try {
      const res = await fetch("/api/portfolio/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, data: updatedData })
      });
      const resJson = await res.json();
      if (res.ok) {
        triggerNotification("success", "Base de données sauvegardée avec succès !");
        fetchData();
      } else {
        triggerNotification("error", resJson.error || "Échec de l'authentification.");
      }
    } catch (err) {
      triggerNotification("error", "Erreur réseau.");
    }
  };

  // Upload CV PDF
  const handleCvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;
    setUploadingCv(true);
    
    const formData = new FormData();
    formData.append("file", cvFile);
    formData.append("password", password);

    try {
      const res = await fetch("/api/portfolio/upload-cv", {
        method: "POST",
        body: formData
      });
      const resJson = await res.json();
      if (res.ok) {
        triggerNotification("success", "Le CV PDF a été mis à jour avec succès !");
        setCvFile(null);
      } else {
        triggerNotification("error", resJson.error || "Erreur de téléversement.");
      }
    } catch (err) {
      triggerNotification("error", "Erreur réseau.");
    } finally {
      setUploadingCv(false);
    }
  };

  // Add items
  const addSkill = () => {
    if (!newSkill.name) return;
    const updated = { ...dbData };
    const catIdx = updated.skills.findIndex((c: any) => c.category === newSkill.category);
    if (catIdx > -1) {
      updated.skills[catIdx].skills.push({ name: newSkill.name, level: newSkill.level });
    } else {
      updated.skills.push({
        category: newSkill.category,
        skills: [{ name: newSkill.name, level: newSkill.level }]
      });
    }
    setDbData(updated);
    setNewSkill({ ...newSkill, name: "" });
    saveDatabase(updated);
  };

  const removeSkill = (catName: string, skillName: string) => {
    const updated = { ...dbData };
    const catIdx = updated.skills.findIndex((c: any) => c.category === catName);
    if (catIdx > -1) {
      updated.skills[catIdx].skills = updated.skills[catIdx].skills.filter((s: any) => s.name !== skillName);
      setDbData(updated);
      saveDatabase(updated);
    }
  };

  const addProject = () => {
    if (!newProject.id || !newProject.title.fr) return;
    const updated = { ...dbData };
    const techsArray = newProject.techs.split(",").map(t => t.trim()).filter(Boolean);
    const item = {
      ...newProject,
      techs: techsArray
    };
    updated.projects.push(item);
    setDbData(updated);
    setNewProject({
      id: "",
      category: "security",
      title: { fr: "", en: "" },
      desc: { fr: "", en: "" },
      techs: "",
      githubUrl: "",
      liveUrl: ""
    });
    saveDatabase(updated);
  };

  const removeProject = (id: string) => {
    const updated = { ...dbData };
    updated.projects = updated.projects.filter((p: any) => p.id !== id);
    setDbData(updated);
    saveDatabase(updated);
  };

  const addBlogPost = () => {
    if (!newBlogPost.id || !newBlogPost.title.fr) return;
    const updated = { ...dbData };
    updated.blogPosts.unshift(newBlogPost);
    setDbData(updated);
    setNewBlogPost({
      id: "",
      category: "cyber",
      date: new Date().toISOString().split("T")[0],
      author: "Koladé",
      title: { fr: "", en: "" },
      desc: { fr: "", en: "" },
      content: { fr: "", en: "" }
    });
    saveDatabase(updated);
  };

  const removeBlogPost = (id: string) => {
    const updated = { ...dbData };
    updated.blogPosts = updated.blogPosts.filter((b: any) => b.id !== id);
    setDbData(updated);
    saveDatabase(updated);
  };

  const addEdu = () => {
    if (!newEdu.school.fr || !newEdu.degree.fr) return;
    const updated = { ...dbData };
    updated.education.unshift(newEdu);
    setDbData(updated);
    setNewEdu({
      year: { fr: "", en: "" },
      school: { fr: "", en: "" },
      degree: { fr: "", en: "" },
      desc: { fr: "", en: "" }
    });
    saveDatabase(updated);
  };

  const removeEdu = (index: number) => {
    const updated = { ...dbData };
    updated.education.splice(index, 1);
    setDbData(updated);
    saveDatabase(updated);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center p-6 text-slate-200">
        <div className="scanlines" />
        <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-slate-950/80 border border-cyan-500/30 p-8 rounded-2xl glow-cyan relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600" />
          
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <ShieldAlert className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <h1 className="text-lg font-mono font-bold tracking-widest text-slate-100 uppercase">
              CONSOLE D&apos;ADMINISTRATION
            </h1>
            <p className="text-[10px] font-mono text-cyan-500">
              Veuillez vous authentifier pour accéder à la base de données
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                PHRASE SECRÈTE DE L&apos;OPÉRATEUR
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/20 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,240,255,0.3)] rounded-lg px-4 py-3 pl-10 text-sm text-slate-100 outline-none font-mono transition-all duration-300"
                  placeholder="••••••••••••••"
                />
                <Lock className="w-4 h-4 text-cyan-500/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {errorMsg && (
              <div className="text-[10px] font-mono text-red-400 bg-red-950/20 p-2.5 rounded border border-red-500/20 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-lg text-xs transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              INITIALISER LA LIAISON
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-200 font-mono text-xs flex flex-col">
      <div className="scanlines" />
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />

      {/* Header bar */}
      <header className="border-b border-cyan-500/10 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
          <div>
            <h1 className="text-sm font-bold tracking-widest text-slate-200">PORTFOLIO SOC ADMIN PANEL</h1>
            <p className="text-[9px] text-cyan-400">DATABASE: VERIFIED & ACCESSIBLE</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open("/", "_blank")}
            className="border border-cyan-500/20 hover:border-cyan-400/50 px-3 py-1.5 rounded text-[10px] transition-all duration-300 cursor-pointer"
          >
            Voir le site
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-950/30 border border-red-500/30 hover:bg-red-900/40 text-red-400 px-3 py-1.5 rounded text-[10px] transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Panel grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-950/80 border border-cyan-500/10 rounded-xl p-4 space-y-1">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">MODULES</h3>
            
            {[
              { id: "cv", label: "Mise à jour CV (PDF)", icon: FileUp },
              { id: "skills", label: "Compétences", icon: Award },
              { id: "projects", label: "Répertoire de Projets", icon: Code },
              { id: "blog", label: "Journal de Bord (Blog)", icon: BookOpen },
              { id: "education", label: "Parcours / Stages", icon: Briefcase }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id 
                    ? "bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.1)]" 
                    : "hover:bg-slate-900/60 border border-transparent text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeTab === tab.id ? "rotate-90 text-cyan-400" : ""}`} />
              </button>
            ))}
          </div>

          {successMsg && (
            <div className="text-[10px] font-mono text-green-400 bg-green-950/20 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="text-[10px] font-mono text-red-400 bg-red-950/20 p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Content Workspace Area */}
        <div className="md:col-span-3">
          <div className="bg-slate-950/80 border border-cyan-500/10 rounded-xl p-6 min-h-[500px]">
            {!dbData ? (
              <div className="h-full flex items-center justify-center text-slate-500">
                <span>Chargement de la base de données...</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* 1. CV Uploader */}
                {activeTab === "cv" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">TÉLÉVERSEMENT DU CV PDF</h2>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Remplacez instantanément le fichier /public/CV.pdf pour mettre à jour votre CV téléchargeable.
                      </p>
                    </div>

                    <form onSubmit={handleCvUpload} className="bg-slate-900/50 border border-cyan-500/15 p-6 rounded-xl space-y-4">
                      <div className="border-2 border-dashed border-cyan-500/25 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-950/30 hover:border-cyan-400/50 transition-colors relative">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FileUp className="w-10 h-10 text-cyan-500/60 mb-2" />
                        {cvFile ? (
                          <span className="text-cyan-400 font-semibold">{cvFile.name}</span>
                        ) : (
                          <span className="text-slate-400 text-center">Glissez-déposez ou cliquez pour sélectionner le fichier PDF de votre CV</span>
                        )}
                        <span className="text-[9px] text-slate-600 mt-1">Taille max conseillée : 5Mo (Fichier PDF uniquement)</span>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!cvFile || uploadingCv}
                          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 cursor-pointer text-[10px]"
                        >
                          <Save className="w-4 h-4" />
                          {uploadingCv ? "MISE À JOUR..." : "TÉLÉVERSER LE NOUVEAU CV"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 2. Skills Editor */}
                {activeTab === "skills" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">GESTION DES COMPÉTENCES</h2>
                      <p className="text-[10px] text-slate-500 mt-1">Ajoutez ou supprimez des compétences classées par catégories techniques.</p>
                    </div>

                    {/* Add skill form */}
                    <div className="bg-slate-900/50 border border-cyan-500/15 p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="text-[9px] text-slate-500 block mb-1">Catégorie</label>
                        <select
                          value={newSkill.category}
                          onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                          className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                        >
                          <option value="networks">Réseaux</option>
                          <option value="security">Sécurité</option>
                          <option value="os">Systèmes OS</option>
                          <option value="dev">Développement</option>
                          <option value="db">Bases de données</option>
                          <option value="tools">Outils cyber</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[9px] text-slate-500 block mb-1">Nom du Skill</label>
                        <input
                          type="text"
                          value={newSkill.name}
                          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                          placeholder="Ex: Wireshark Packet Analysis"
                          className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                        />
                      </div>

                      <div>
                        <button
                          onClick={addSkill}
                          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter
                        </button>
                      </div>
                    </div>

                    {/* Skill List grid */}
                    <div className="space-y-4">
                      {dbData.skills.map((categoryObj: any) => (
                        <div key={categoryObj.category} className="border border-slate-900 rounded-lg p-4 bg-slate-900/20">
                          <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-3">{categoryObj.category}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {categoryObj.skills.map((sk: any, idx: number) => (
                              <div key={idx} className="bg-slate-950/80 border border-cyan-500/5 px-3 py-2 rounded flex items-center justify-between">
                                <span className="font-semibold text-slate-300">{sk.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] text-cyan-500">{sk.level}%</span>
                                  <button
                                    onClick={() => removeSkill(categoryObj.category, sk.name)}
                                    className="text-red-400/70 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 3. Projects Editor */}
                {activeTab === "projects" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">RÉPERTOIRE DE PROJETS</h2>
                      <p className="text-[10px] text-slate-500 mt-1">Ajoutez ou supprimez des dossiers de projets techniques.</p>
                    </div>

                    {/* Form add project */}
                    <div className="bg-slate-900/50 border border-cyan-500/15 p-4 rounded-xl space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">ID Unique (ex: videosurveillance)</label>
                          <input
                            type="text"
                            value={newProject.id}
                            onChange={(e) => setNewProject({ ...newProject, id: e.target.value })}
                            placeholder="videosurveillance"
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Catégorie</label>
                          <select
                            value={newProject.category}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          >
                            <option value="security">Cybersécurité</option>
                            <option value="sys">Systèmes & Réseaux</option>
                            <option value="dev">Développement</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Technologies (séparées par des virgules)</label>
                          <input
                            type="text"
                            value={newProject.techs}
                            onChange={(e) => setNewProject({ ...newProject, techs: e.target.value })}
                            placeholder="React, Next.js, Tail"
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Titre (FR)</label>
                          <input
                            type="text"
                            value={newProject.title.fr}
                            onChange={(e) => setNewProject({ 
                              ...newProject, 
                              title: { ...newProject.title, fr: e.target.value } 
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Titre (EN)</label>
                          <input
                            type="text"
                            value={newProject.title.en}
                            onChange={(e) => setNewProject({ 
                              ...newProject, 
                              title: { ...newProject.title, en: e.target.value } 
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Description (FR)</label>
                          <textarea
                            rows={2}
                            value={newProject.desc.fr}
                            onChange={(e) => setNewProject({ 
                              ...newProject, 
                              desc: { ...newProject.desc, fr: e.target.value } 
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Description (EN)</label>
                          <textarea
                            rows={2}
                            value={newProject.desc.en}
                            onChange={(e) => setNewProject({ 
                              ...newProject, 
                              desc: { ...newProject.desc, en: e.target.value } 
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none resize-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Lien GitHub (optionnel)</label>
                          <input
                            type="text"
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Lien Live / Demo (optionnel)</label>
                          <input
                            type="text"
                            value={newProject.liveUrl}
                            onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={addProject}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2 rounded flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter le projet
                        </button>
                      </div>
                    </div>

                    {/* Projects list */}
                    <div className="space-y-3">
                      {dbData.projects.map((proj: any) => (
                        <div key={proj.id} className="bg-slate-900/25 border border-cyan-500/10 p-4 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20 uppercase font-mono mr-2">{proj.category}</span>
                            <span className="font-semibold text-slate-200">{proj.title.fr}</span>
                            <p className="text-[10px] text-slate-500 mt-1 max-w-xl">{proj.desc.fr}</p>
                          </div>
                          <button
                            onClick={() => removeProject(proj.id)}
                            className="text-red-400/80 hover:text-red-400 p-2 hover:bg-red-950/20 rounded transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. Blog Editor */}
                {activeTab === "blog" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">JOURNAL DE BORD (BLOG)</h2>
                      <p className="text-[10px] text-slate-500 mt-1">Publiez ou supprimez vos articles et retours d&apos;expérience.</p>
                    </div>

                    {/* Blog form */}
                    <div className="bg-slate-900/50 border border-cyan-500/15 p-4 rounded-xl space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">ID de l&apos;article (ex: secure-ssh)</label>
                          <input
                            type="text"
                            value={newBlogPost.id}
                            onChange={(e) => setNewBlogPost({ ...newBlogPost, id: e.target.value })}
                            placeholder="secure-ssh"
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Catégorie</label>
                          <select
                            value={newBlogPost.category}
                            onChange={(e) => setNewBlogPost({ ...newBlogPost, category: e.target.value })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          >
                            <option value="cyber">Cybersécurité</option>
                            <option value="network">Réseaux</option>
                            <option value="linux">Linux & DevOps</option>
                            <option value="tutorials">Tutoriels</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Date</label>
                          <input
                            type="date"
                            value={newBlogPost.date}
                            onChange={(e) => setNewBlogPost({ ...newBlogPost, date: e.target.value })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Titre (FR)</label>
                          <input
                            type="text"
                            value={newBlogPost.title.fr}
                            onChange={(e) => setNewBlogPost({
                              ...newBlogPost,
                              title: { ...newBlogPost.title, fr: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Titre (EN)</label>
                          <input
                            type="text"
                            value={newBlogPost.title.en}
                            onChange={(e) => setNewBlogPost({
                              ...newBlogPost,
                              title: { ...newBlogPost.title, en: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Mini-description (FR)</label>
                          <textarea
                            rows={2}
                            value={newBlogPost.desc.fr}
                            onChange={(e) => setNewBlogPost({
                              ...newBlogPost,
                              desc: { ...newBlogPost.desc, fr: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Mini-description (EN)</label>
                          <textarea
                            rows={2}
                            value={newBlogPost.desc.en}
                            onChange={(e) => setNewBlogPost({
                              ...newBlogPost,
                              desc: { ...newBlogPost.desc, en: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none resize-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Contenu Markdown de l&apos;article (FR)</label>
                          <textarea
                            rows={6}
                            value={newBlogPost.content.fr}
                            onChange={(e) => setNewBlogPost({
                              ...newBlogPost,
                              content: { ...newBlogPost.content, fr: e.target.value }
                            })}
                            placeholder="## Titre principal..."
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Contenu Markdown de l&apos;article (EN)</label>
                          <textarea
                            rows={6}
                            value={newBlogPost.content.en}
                            onChange={(e) => setNewBlogPost({
                              ...newBlogPost,
                              content: { ...newBlogPost.content, en: e.target.value }
                            })}
                            placeholder="## Main title..."
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none font-sans"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={addBlogPost}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2 rounded flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Publier l&apos;article
                        </button>
                      </div>
                    </div>

                    {/* Blog list */}
                    <div className="space-y-3">
                      {dbData.blogPosts.map((post: any) => (
                        <div key={post.id} className="bg-slate-900/25 border border-cyan-500/10 p-4 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="text-[8px] text-slate-500 mr-2">{post.date}</span>
                            <span className="font-semibold text-slate-200">{post.title.fr}</span>
                          </div>
                          <button
                            onClick={() => removeBlogPost(post.id)}
                            className="text-red-400/80 hover:text-red-400 p-2 hover:bg-red-950/20 rounded transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 5. Education timeline Editor */}
                {activeTab === "education" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">PARCOURS ACADÉMIQUE / STAGES</h2>
                      <p className="text-[10px] text-slate-500 mt-1">Gérez la chronologie de vos études et expériences.</p>
                    </div>

                    {/* Form add timeline item */}
                    <div className="bg-slate-900/50 border border-cyan-500/15 p-4 rounded-xl space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Années / Date (FR - ex: Fév. 2026)</label>
                          <input
                            type="text"
                            value={newEdu.year.fr}
                            onChange={(e) => setNewEdu({
                              ...newEdu,
                              year: { ...newEdu.year, fr: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Années / Date (EN)</label>
                          <input
                            type="text"
                            value={newEdu.year.en}
                            onChange={(e) => setNewEdu({
                              ...newEdu,
                              year: { ...newEdu.year, en: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Structure / École (FR)</label>
                          <input
                            type="text"
                            value={newEdu.school.fr}
                            onChange={(e) => setNewEdu({
                              ...newEdu,
                              school: { ...newEdu.school, fr: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Structure / École (EN)</label>
                          <input
                            type="text"
                            value={newEdu.school.en}
                            onChange={(e) => setNewEdu({
                              ...newEdu,
                              school: { ...newEdu.school, en: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Diplôme / Mission (FR)</label>
                          <input
                            type="text"
                            value={newEdu.degree.fr}
                            onChange={(e) => setNewEdu({
                              ...newEdu,
                              degree: { ...newEdu.degree, fr: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Diplôme / Mission (EN)</label>
                          <input
                            type="text"
                            value={newEdu.degree.en}
                            onChange={(e) => setNewEdu({
                              ...newEdu,
                              degree: { ...newEdu.degree, en: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Description (FR)</label>
                          <textarea
                            rows={3}
                            value={newEdu.desc.fr}
                            onChange={(e) => setNewEdu({
                              ...newEdu,
                              desc: { ...newEdu.desc, fr: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block mb-1">Description (EN)</label>
                          <textarea
                            rows={3}
                            value={newEdu.desc.en}
                            onChange={(e) => setNewEdu({
                              ...newEdu,
                              desc: { ...newEdu.desc, en: e.target.value }
                            })}
                            className="w-full bg-slate-950 border border-cyan-500/20 px-3 py-2 rounded text-slate-200 outline-none resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={addEdu}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2 rounded flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter au parcours
                        </button>
                      </div>
                    </div>

                    {/* Timeline items list */}
                    <div className="space-y-3">
                      {dbData.education.map((edu: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/25 border border-cyan-500/10 p-4 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20 uppercase font-mono mr-2">{edu.year.fr}</span>
                            <span className="font-semibold text-slate-200">{edu.school.fr} - {edu.degree.fr}</span>
                            <p className="text-[10px] text-slate-500 mt-1 max-w-xl">{edu.desc.fr}</p>
                          </div>
                          <button
                            onClick={() => removeEdu(idx)}
                            className="text-red-400/80 hover:text-red-400 p-2 hover:bg-red-950/20 rounded transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
