// lib/hooks/useTeacherProfile.ts
import { useState, useEffect } from "react";

export type Experience = {
  id: string;
  poste: string;
  etablissement: string;
  debut: string;
  fin?: string;
  enCours: boolean;
  description: string;
};

export type Formation = {
  id: string;
  diplome: string;
  etablissement: string;
  annee: string;
  description?: string;
};

export type Certification = {
  id: string;
  titre: string;
  organisme: string;
  date: string;
  lien?: string;
};

export function useTeacherProfile() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger toutes les données
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [expRes, formRes, certRes] = await Promise.all([
        fetch("/api/enseignants/experiences"),
        fetch("/api/enseignants/formations"),
        fetch("/api/enseignants/certifications")
      ]);

      const [expData, formData, certData] = await Promise.all([
        expRes.json(),
        formRes.json(),
        certRes.json()
      ]);

      setExperiences(expData.experiences || []);
      setFormations(formData.formations || []);
      setCertifications(certData.certifications || []);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des expériences
  const addExperience = async (exp: Omit<Experience, "id">) => {
    try {
      const res = await fetch("/api/enseignants/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(exp)
      });

      if (!res.ok) throw new Error("Failed to add experience");

      const { experience } = await res.json();
      setExperiences([experience, ...experiences]);
      return experience;
    } catch (error) {
      console.error("Error adding experience:", error);
      throw error;
    }
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      const res = await fetch("/api/enseignants/experiences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, ...updates })
      });

      if (!res.ok) throw new Error("Failed to update experience");

      const { experience } = await res.json();
      setExperiences(experiences.map(exp => exp.id === id ? experience : exp));
      return experience;
    } catch (error) {
      console.error("Error updating experience:", error);
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const res = await fetch(`/api/enseignants/experiences?id=${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to delete experience");

      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
      throw error;
    }
  };

  // Gestion des formations
  const addFormation = async (form: Omit<Formation, "id">) => {
    try {
      const res = await fetch("/api/enseignants/formations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed to add formation");

      const { formation } = await res.json();
      setFormations([formation, ...formations]);
      return formation;
    } catch (error) {
      console.error("Error adding formation:", error);
      throw error;
    }
  };

  const deleteFormation = async (id: string) => {
    try {
      const res = await fetch(`/api/enseignants/formations?id=${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to delete formation");

      setFormations(formations.filter(form => form.id !== id));
    } catch (error) {
      console.error("Error deleting formation:", error);
      throw error;
    }
  };

  // Gestion des certifications
  const addCertification = async (cert: Omit<Certification, "id">) => {
    try {
      const res = await fetch("/api/enseignants/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(cert)
      });

      if (!res.ok) throw new Error("Failed to add certification");

      const { certification } = await res.json();
      setCertifications([certification, ...certifications]);
      return certification;
    } catch (error) {
      console.error("Error adding certification:", error);
      throw error;
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      const res = await fetch(`/api/enseignants/certifications?id=${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to delete certification");

      setCertifications(certifications.filter(cert => cert.id !== id));
    } catch (error) {
      console.error("Error deleting certification:", error);
      throw error;
    }
  };

  // Upload de CV
  const uploadCV = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("cv", file);

      const res = await fetch("/api/enseignants/cv/analyze", {
        method: "POST",
        credentials:"include",
        body: formData
      });

      if (!res.ok){
        const error = await res.json();
        throw new Error(error.error || "Erreur lors de l'analyse du CV");
      } 

      const data = await res.json();  
      return data;
    } catch (error) {
      console.error("Error uploading CV:", error);
      throw error;
    }
  };

   // Confirmer et sauvegarder les données analysées
  const confirmCVData = async (cvData: {
    experiences: Omit<Experience, "id">[];
    formations: Omit<Formation, "id">[];
    certifications: Omit<Certification, "id">[];
    replaceExisting?: boolean;
  }) => {
    try {
      const res = await fetch("/api/enseignants/cv/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(cvData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur lors de la sauvegarde");
      }

      const data = await res.json();
      
      // Recharger les données après confirmation
      await loadAllData();
      
      return data;
    } catch (error) {
      console.error("Error confirming CV data:", error);
      throw error;
    }
  };

  return {
    experiences,
    formations,
    certifications,
    loading,
    addExperience,
    updateExperience,
    deleteExperience,
    addFormation,
    deleteFormation,
    addCertification,
    deleteCertification,
    uploadCV,
    confirmCVData,
    refresh: loadAllData
  };
}