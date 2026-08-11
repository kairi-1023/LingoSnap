export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export function validateAndSanitizeInput(input: File | string, tr?: (key: string, opts?: any) => string): { isValid: boolean; errorMessage?: string } {
  const _t = tr || ((key: string) => key);
  if (typeof File !== 'undefined' && input instanceof File) {
    const isSvg = input.type.includes('svg') || input.name.toLowerCase().endsWith('.svg');
    if (isSvg) {
      return {
        isValid: false,
        errorMessage: _t('errors.svgBlocked'),
      };
    }

    if (input.size > MAX_FILE_SIZE_BYTES) {
      return { isValid: false, errorMessage: _t('errors.fileTooLarge', { size: 15 }) };
    }

    const mime = input.type.toLowerCase();
    if (!ALLOWED_IMAGE_MIMES.includes(mime)) {
      return {
        isValid: false,
        errorMessage: _t('errors.invalidFormat'),
      };
    }
    return { isValid: true };
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) {
      return { isValid: false, errorMessage: _t('errors.noPhoto') };
    }

    const lower = trimmed.toLowerCase();
    if (lower.includes('.svg') || lower.includes('data:image/svg')) {
      return {
        isValid: false,
        errorMessage: _t('errors.svgUrlBlocked'),
      };
    }

    if (
      lower.startsWith('javascript:') ||
      lower.startsWith('vbscript:') ||
      lower.startsWith('file:') ||
      lower.includes('<script') ||
      lower.includes('javascript:')
    ) {
      return { isValid: false, errorMessage: _t('errors.xssBlocked') };
    }

    if (
      lower.startsWith('data:') &&
      !lower.startsWith('data:image/jpeg') &&
      !lower.startsWith('data:image/jpg') &&
      !lower.startsWith('data:image/png') &&
      !lower.startsWith('data:image/webp')
    ) {
      return {
        isValid: false,
        errorMessage: _t('errors.unsupportedDataUri'),
      };
    }

    if (!lower.startsWith('http://') && !lower.startsWith('https://') && !lower.startsWith('data:image/')) {
      return {
        isValid: false,
        errorMessage: _t('errors.invalidUrl'),
      };
    }

    return { isValid: true };
  }

  return { isValid: false, errorMessage: _t('errors.invalidInput') };
}

export function resizeAndCompressImage(
  dataUrl: string,
  maxWidth = 250,
  maxHeight = 250,
  quality = 0.75
): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return resolve(dataUrl);
    }

    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
      return resolve(dataUrl);
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width === 0 || height === 0) {
        return resolve(null);
      }

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(null);
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = dataUrl;
  });
}
