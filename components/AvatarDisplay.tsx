// components/AvatarDisplay.tsx
"use client";

interface AvatarDisplayProps {
  name: string;
  avatar?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export function AvatarDisplay({
  name,
  avatar,
  size = 'md',
  className = '',
  showBorder = true
}: AvatarDisplayProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-32 h-32 text-5xl'
  };

  const borderClass = showBorder ? 'border-4 border-white shadow-lg' : '';

  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    return fullName
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (fullName: string) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-blue-500 to-cyan-600',
      'from-pink-500 to-rose-600',
      'from-violet-500 to-fuchsia-600',
      'from-amber-500 to-orange-600',
      'from-cyan-500 to-blue-600'
    ];
    
    // Utiliser les codes des caractères pour un hash déterministe
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = ((hash << 5) - hash) + fullName.charCodeAt(i);
      hash = hash & hash; // Convertir en entier 32-bit
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Si l'avatar est une image (URL ou base64)
  if (avatar && (avatar.startsWith('data:image') || avatar.startsWith('http') || avatar.startsWith('/uploads'))) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClasses[size]} rounded-xl object-cover ${borderClass} ${className}`}
        onError={(e) => {
          // Fallback si l'image ne charge pas
          console.warn('Avatar image failed to load:', avatar);
        }}
      />
    );
  }

  // Fallback: Initiales avec gradient
  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br ${getAvatarColor(name)} rounded-xl flex items-center justify-center text-white font-bold ${borderClass} ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}

// Export aussi une version simple pour les notifications/listes
export function AvatarBadge({
  name,
  avatar,
  size = 'sm'
}: Omit<AvatarDisplayProps, 'showBorder'>) {
  return <AvatarDisplay name={name} avatar={avatar} size={size} showBorder={false} />;
}