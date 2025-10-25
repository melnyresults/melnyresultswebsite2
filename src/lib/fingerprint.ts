export const generateFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let fingerprint = '';

  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    fingerprint += canvas.toDataURL();
  }

  fingerprint += navigator.userAgent;
  fingerprint += navigator.language;
  fingerprint += screen.colorDepth;
  fingerprint += screen.width + 'x' + screen.height;
  fingerprint += new Date().getTimezoneOffset();

  return hashString(fingerprint);
};

const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};
