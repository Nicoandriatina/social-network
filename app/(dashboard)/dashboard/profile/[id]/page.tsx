"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import Link from "next/link";
import ProfileViewEtablissement from "@/components/ProfilComponent/ProfileViewEtablissemnet";
import ProfileViewEnseignant from "@/components/ProfilComponent/ProfilViewEnseignant";
import ProfileViewDonateur from "@/components/ProfilComponent/ProfilViewDonateur";

type UserProfile = {
  id: string;
  nom: string;
  email: string;
  typeProfil: "ETABLISSEMENT" | "ENSEIGNANT" | "DONATEUR";
  isFriend: boolean;
  friendRequestPending: boolean;
  isOwnProfile: boolean;
  avatar?: string;
  telephone?: string;
  facebook?: string;
  twitter?: string;
  whatsapp?: string;
  etablissement?: any;
  enseignant?: any;
  donateur?: any;
};

export default function ProfilePage() {
  const { user: currentUser, loading: currentUserLoading } = useCurrentUser();
  const params = useParams();
  const id = params?.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/user/${id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!profile || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: profile.id }),
        credentials: "include",
      });
      if (res.ok) {
        setProfile({ ...profile, friendRequestPending: true });
        alert("✅ Demande d'ami envoyée!");
      }
    } catch (err) {
      alert("❌ Erreur");
    } finally {
      setSending(false);
    }
  };

  if (currentUserLoading || loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    );
  }

  if (profile?.isOwnProfile) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4">Vous êtes sur votre propre profil</p>
        <Link href="/dashboard" className="text-indigo-600 hover:underline">
          ← Aller au dashboard
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4">Utilisateur non trouvé</p>
        <Link href="/dashboard" className="text-indigo-600 hover:underline">
          ← Retour
        </Link>
      </div>
    );
  }

  return (
    <>
      {profile.typeProfil === "ETABLISSEMENT" && (
        <ProfileViewEtablissement
          profile={profile}
          onSendFriendRequest={handleSendFriendRequest}
          isSending={sending}
        />
      )}
      {profile.typeProfil === "ENSEIGNANT" && (
        <ProfileViewEnseignant
          profile={profile}
          onSendFriendRequest={handleSendFriendRequest}
          isSending={sending}
        />
      )}
      {profile.typeProfil === "DONATEUR" && (
        <ProfileViewDonateur
          profile={profile}
          onSendFriendRequest={handleSendFriendRequest}
          isSending={sending}
        />
      )}
    </>
  );
}