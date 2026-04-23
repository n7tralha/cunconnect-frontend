import React from 'react';
import pb from '@/lib/pocketbaseClient.js';

export default function UserAvatar({ user, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl'
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = () => {
    if (user?.profile_picture) {
      return pb.files.getUrl(user, user.profile_picture);
    }
    if (user?.avatar) {
      return pb.files.getUrl(user, user.avatar);
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();
  const initials = getInitials(user?.name);

  const bgColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500'
  ];
  
  const colorIndex = user?.id ? user.id.charCodeAt(0) % bgColors.length : 0;
  const bgColor = bgColors[colorIndex];

  return (
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex items-center justify-center font-semibold text-white ${!avatarUrl ? bgColor : ''}`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={user?.name || 'Usuario'} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}