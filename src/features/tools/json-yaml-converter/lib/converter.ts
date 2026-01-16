import yaml from 'js-yaml';

export interface ConvertResult {
  success: boolean;
  output: string;
  error?: string;
}

/**
 * JSON 문자열을 YAML 문자열로 변환
 */
export function jsonToYaml(input: string, indent: number = 2): ConvertResult {
  if (!input.trim()) {
    return { success: true, output: '' };
  }

  try {
    const jsonObj = JSON.parse(input);
    const yamlStr = yaml.dump(jsonObj, {
      indent,
      lineWidth: -1, // 줄 바꿈 비활성화
      noRefs: true, // 참조 비활성화
      sortKeys: false, // 키 정렬 비활성화
    });
    return { success: true, output: yamlStr };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, output: '', error: errorMessage };
  }
}

/**
 * YAML 문자열을 JSON 문자열로 변환
 */
export function yamlToJson(input: string, indent: number = 2): ConvertResult {
  if (!input.trim()) {
    return { success: true, output: '' };
  }

  try {
    const yamlObj = yaml.load(input);
    const jsonStr = JSON.stringify(yamlObj, null, indent);
    return { success: true, output: jsonStr };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, output: '', error: errorMessage };
  }
}
