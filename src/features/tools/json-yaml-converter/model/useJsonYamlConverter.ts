import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { copyToClipboard as copyToClipboardUtil } from '@/shared/lib/clipboard-utils';
import { jsonToYaml, yamlToJson } from '../lib/converter';

export type ConvertMode = 'json-to-yaml' | 'yaml-to-json';
export type IndentSize = 2 | 4;

export const useJsonYamlConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ConvertMode>('json-to-yaml');
  const [indent, setIndent] = useState<IndentSize>(2);
  const t = useTranslations('tools.jsonYamlConverter.ui');
  const tCommon = useTranslations('common.toast');

  // 실시간 변환 로직
  const transform = useCallback((text: string, currentMode: ConvertMode, currentIndent: IndentSize) => {
    if (!text.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    const result = currentMode === 'json-to-yaml'
      ? jsonToYaml(text, currentIndent)
      : yamlToJson(text, currentIndent);

    if (result.success) {
      setOutput(result.output);
      setError(null);
    } else {
      setOutput('');
      setError(result.error || t('conversionFailed'));
    }
  }, [t]);

  // input, mode, indent 변경 시 실시간 변환
  useEffect(() => {
    transform(input, mode, indent);
  }, [input, mode, indent, transform]);

  const handleModeChange = (newMode: ConvertMode) => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleIndentChange = (newIndent: IndentSize) => {
    setIndent(newIndent);
  };

  const handleSwap = () => {
    if (!output || error) return;

    // 출력을 입력으로, 모드 전환
    const newMode: ConvertMode = mode === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml';
    setInput(output);
    setMode(newMode);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
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
    indent,
    handleModeChange,
    handleIndentChange,
    handleSwap,
    handleClear,
    copyToClipboard,
  };
};
