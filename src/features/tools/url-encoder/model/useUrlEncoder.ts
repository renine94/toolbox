import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { copyToClipboard as copyToClipboardUtil } from "@/shared/lib/clipboard-utils";
import { useTranslations } from 'next-intl';

type Mode = 'encode' | 'decode';
type EncodingType = 'component' | 'fullUri';

export const useUrlEncoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('encode');
  const [encodingType, setEncodingType] = useState<EncodingType>('component');
  const t = useTranslations('tools.urlEncoder.ui');
  const tCommon = useTranslations('common.toast');

  // 실시간 변환 로직
  const transform = useCallback((text: string, currentMode: Mode, currentType: EncodingType) => {
    if (!text.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (currentMode === 'encode') {
        const encoded = currentType === 'component'
          ? encodeURIComponent(text)
          : encodeURI(text);
        setOutput(encoded);
        setError(null);
      } else {
        const decoded = currentType === 'component'
          ? decodeURIComponent(text)
          : decodeURI(text);
        setOutput(decoded);
        setError(null);
      }
    } catch {
      setOutput('');
      setError(currentMode === 'encode' ? t('encodeFailed') : t('decodeFailed'));
    }
  }, [t]);

  // input, mode, encodingType 변경 시 실시간 변환
  useEffect(() => {
    transform(input, mode, encodingType);
  }, [input, mode, encodingType, transform]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleEncodingTypeChange = (newType: EncodingType) => {
    setEncodingType(newType);
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    const success = await copyToClipboardUtil(text);
    if (success) {
      toast.success(tCommon('copied'));
    } else {
      toast.error(tCommon('copyError'));
    }
  };

  return {
    input,
    setInput,
    output,
    error,
    mode,
    encodingType,
    handleModeChange,
    handleEncodingTypeChange,
    copyToClipboard
  };
};
