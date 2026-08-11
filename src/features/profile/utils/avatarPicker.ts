import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { validateAndSanitizeInput, resizeAndCompressImage } from '../../../shared/utils/imageUtils';

export interface AvatarPickResult {
  success: boolean;
  avatarUrl?: string;
  errorKey?: string;
  errorDefault?: string;
}

export async function pickAndCompressAvatar(
  t: (key: string, defaultValue?: string) => string
): Promise<AvatarPickResult> {
  if (Platform.OS === 'web' || typeof document !== 'undefined') {
    return new Promise<AvatarPickResult>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/png,image/webp,image/*';
      input.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (!file) {
          resolve({ success: false });
          return;
        }

        const isSvg = file.type.includes('svg') || file.name.toLowerCase().endsWith('.svg');
        if (isSvg) {
          resolve({ success: false, errorKey: 'errors.selectedFileError' });
          return;
        }

        const validation = validateAndSanitizeInput(file, t);
        if (!validation.isValid) {
          resolve({
            success: false,
            errorKey: 'errors.invalidFormat',
            errorDefault: validation.errorMessage,
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
          const rawDataUrl = event.target?.result as string;
          if (rawDataUrl) {
            const compressedUrl = await resizeAndCompressImage(rawDataUrl, 250, 250, 0.75);
            if (!compressedUrl) {
              resolve({ success: false, errorKey: 'errors.fileCorrupted' });
              return;
            }
            resolve({ success: true, avatarUrl: compressedUrl });
          } else {
            resolve({ success: false, errorKey: 'errors.fileReadFailed' });
          }
        };
        reader.onerror = () => {
          resolve({ success: false, errorKey: 'errors.fileReadFailed' });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  } else {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        return {
          success: false,
          errorKey: 'errors.cameraPermissionDenied',
          errorDefault: 'Permission to access media library is required!',
        };
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
        base64: true,
      });

      if (pickerResult.canceled) {
        return { success: false };
      }

      const selectedAsset = pickerResult.assets?.[0];
      if (selectedAsset && selectedAsset.base64) {
        const mimeType = selectedAsset.mimeType || 'image/jpeg';
        const rawDataUrl = `data:${mimeType};base64,${selectedAsset.base64}`;

        const compressedUrl = await resizeAndCompressImage(rawDataUrl, 250, 250, 0.75);
        if (!compressedUrl) {
          return { success: false, errorKey: 'errors.fileCorrupted' };
        }
        return { success: true, avatarUrl: compressedUrl };
      } else {
        return { success: false, errorKey: 'errors.fileReadFailed' };
      }
    } catch (error) {
      return { success: false, errorKey: 'errors.fileReadFailed' };
    }
  }
}
