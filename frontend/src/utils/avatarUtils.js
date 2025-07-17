// Utility functions for handling avatar URLs

/**
 * Get the full avatar URL from a relative path
 * @param {string} avatarPath - The avatar path from the backend
 * @param {string} size - The size variant ('small', 'medium', 'large')
 * @returns {string} The full URL to the avatar image
 */
export const getAvatarUrl = (avatarPath, size = 'medium') => {
  // Default avatars for different sizes
  const defaultAvatars = {
    small: "/phoenix/v1.20.1/assets/img/team/40x40/guest.webp",
    medium: "/phoenix/v1.20.1/assets/img/team/72x72/guest.webp",
    large: "/phoenix/v1.20.1/assets/img/team/72x72/guest.webp"
  };

  // If no avatar path, return default
  if (!avatarPath || avatarPath === '') {
    return defaultAvatars[size];
  }

  // If it's already a full URL, return as is
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }

  // If it's a relative path, prepend the backend URL
  if (avatarPath.startsWith('/')) {
    return `http://localhost:5000${avatarPath}`;
  }

  // Fallback to default
  return defaultAvatars[size];
};

/**
 * Get avatar URL for small size (40x40)
 */
export const getSmallAvatarUrl = (avatarPath) => getAvatarUrl(avatarPath, 'small');

/**
 * Get avatar URL for medium size (72x72)
 */
export const getMediumAvatarUrl = (avatarPath) => getAvatarUrl(avatarPath, 'medium');

/**
 * Get avatar URL for large size (96x96)
 */
export const getLargeAvatarUrl = (avatarPath) => getAvatarUrl(avatarPath, 'large'); 