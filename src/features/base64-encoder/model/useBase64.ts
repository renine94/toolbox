import { useState } from 'react';
import { toast } from 'sonner';

type Mode = 'encode' | 'decode';

export const useBase64 = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setInput('');
    setOutput('');
  };

  const handleTransform = () => {
    if (!input.trim()) return;

    try {
      if (mode === 'encode') {
        const encoded = btoa(input); // Note: btoa only supports Latin1. For UTF-8, need verification.
        // Better UTF-8 support:
        const utf8Encoded = btoa(
          encodeURIComponent(input).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
              return String.fromCharCode(parseInt(p1, 16));
            })
        );
        setOutput(utf8Encoded);
        toast.success('Successfully encoded!');
      } else {
        // Decode
        const decoded = decodeURIComponent(
          atob(input)
            .split('')
            .map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        setOutput(decoded);
        toast.success('Successfully decoded!');
      }
    } catch (error) {
      console.error(error);
      toast.error(mode === 'encode' ? 'Encoding failed' : 'Invalid Base64 string');
    }
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return {
    input,
    setInput,
    output,
    setOutput, 
    mode,
    handleModeChange,
    handleTransform,
    copyToClipboard
  };
};
