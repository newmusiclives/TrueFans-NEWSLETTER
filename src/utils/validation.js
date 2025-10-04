export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }

  return null;
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateUrl = (url, fieldName = 'URL') => {
  if (!url) {
    return `${fieldName} is required`;
  }

  try {
    new URL(url);
    return null;
  } catch {
    return `Please enter a valid ${fieldName}`;
  }
};

export const validateApiKey = (key, fieldName = 'API Key') => {
  if (!key) {
    return `${fieldName} is required`;
  }

  if (key.length < 20) {
    return `${fieldName} appears to be invalid`;
  }

  return null;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>]/g, '');
};

export const validateNewsletterTitle = (title) => {
  const error = validateRequired(title, 'Newsletter title');
  if (error) return error;

  if (title.length < 3) {
    return 'Newsletter title must be at least 3 characters';
  }

  if (title.length > 200) {
    return 'Newsletter title must be less than 200 characters';
  }

  return null;
};

export const validateSlug = (slug) => {
  const error = validateRequired(slug, 'Slug');
  if (error) return error;

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return 'Slug must be lowercase letters, numbers, and hyphens only';
  }

  return null;
};
