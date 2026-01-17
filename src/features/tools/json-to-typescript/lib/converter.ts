import { ConversionOptions, ConversionResult } from '../model/types';

/**
 * JSON 값의 TypeScript 타입을 추론합니다.
 */
function inferType(value: unknown, options: ConversionOptions, depth: number = 0): string {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  const type = typeof value;

  switch (type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      if (Array.isArray(value)) {
        return inferArrayType(value, options, depth);
      }
      return inferObjectType(value as Record<string, unknown>, options, depth);
    default:
      return 'unknown';
  }
}

/**
 * 배열의 TypeScript 타입을 추론합니다.
 */
function inferArrayType(arr: unknown[], options: ConversionOptions, depth: number): string {
  if (arr.length === 0) {
    return 'unknown[]';
  }

  // 배열 내 모든 요소의 타입을 수집
  const types = new Set<string>();
  let hasObject = false;
  let mergedObject: Record<string, unknown> = {};

  for (const item of arr) {
    if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
      hasObject = true;
      // 객체들을 병합하여 모든 가능한 속성을 포함
      mergedObject = { ...mergedObject, ...(item as Record<string, unknown>) };
    } else {
      types.add(inferType(item, options, depth + 1));
    }
  }

  // 배열에 객체가 있으면 병합된 객체 타입 사용
  if (hasObject) {
    const objectType = inferObjectType(mergedObject, options, depth + 1);
    types.add(objectType);
  }

  const uniqueTypes = Array.from(types);

  if (uniqueTypes.length === 1) {
    return `${uniqueTypes[0]}[]`;
  }

  // 여러 타입이 있으면 union 타입 배열
  return `(${uniqueTypes.join(' | ')})[]`;
}

/**
 * 객체의 TypeScript 타입을 인라인으로 추론합니다.
 */
function inferObjectType(obj: Record<string, unknown>, options: ConversionOptions, depth: number): string {
  const entries = Object.entries(obj);

  if (entries.length === 0) {
    return 'Record<string, unknown>';
  }

  const indent = '  '.repeat(depth + 1);
  const closingIndent = '  '.repeat(depth);

  const properties = entries.map(([key, value]) => {
    const safeKey = isValidIdentifier(key) ? key : `"${key}"`;
    const optional = options.optionalProperties ? '?' : '';
    const readonly = options.readonlyProperties ? 'readonly ' : '';
    const valueType = inferType(value, options, depth + 1);

    return `${indent}${readonly}${safeKey}${optional}: ${valueType};`;
  });

  return `{\n${properties.join('\n')}\n${closingIndent}}`;
}

/**
 * 유효한 JavaScript 식별자인지 확인합니다.
 */
function isValidIdentifier(name: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

/**
 * TypeScript 인터페이스를 생성합니다.
 */
function generateInterface(
  name: string,
  obj: Record<string, unknown>,
  options: ConversionOptions,
  nestedTypes: Map<string, string>
): string {
  const entries = Object.entries(obj);
  const exportKeyword = options.exportTypes ? 'export ' : '';

  if (entries.length === 0) {
    return `${exportKeyword}interface ${name} {\n  [key: string]: unknown;\n}`;
  }

  const properties = entries.map(([key, value]) => {
    const safeKey = isValidIdentifier(key) ? key : `"${key}"`;
    const optional = options.optionalProperties ? '?' : '';
    const readonly = options.readonlyProperties ? 'readonly ' : '';

    let valueType: string;

    // 중첩 객체 처리
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nestedName = toPascalCase(key);
      valueType = nestedName;

      // 중첩 타입 생성
      const nestedInterface = generateInterface(
        nestedName,
        value as Record<string, unknown>,
        options,
        nestedTypes
      );
      nestedTypes.set(nestedName, nestedInterface);
    }
    // 객체 배열 처리
    else if (Array.isArray(value) && value.length > 0 && value.some(item =>
      item !== null && typeof item === 'object' && !Array.isArray(item)
    )) {
      const nestedName = toPascalCase(key) + 'Item';
      const mergedObject = value.reduce<Record<string, unknown>>((acc, item) => {
        if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
          return { ...acc, ...(item as Record<string, unknown>) };
        }
        return acc;
      }, {});

      const nestedInterface = generateInterface(
        nestedName,
        mergedObject,
        options,
        nestedTypes
      );
      nestedTypes.set(nestedName, nestedInterface);
      valueType = `${nestedName}[]`;
    }
    else {
      valueType = inferType(value, options, 0);
    }

    return `  ${readonly}${safeKey}${optional}: ${valueType};`;
  });

  return `${exportKeyword}interface ${name} {\n${properties.join('\n')}\n}`;
}

/**
 * TypeScript type alias를 생성합니다.
 */
function generateTypeAlias(
  name: string,
  obj: Record<string, unknown>,
  options: ConversionOptions,
  nestedTypes: Map<string, string>
): string {
  const entries = Object.entries(obj);
  const exportKeyword = options.exportTypes ? 'export ' : '';

  if (entries.length === 0) {
    return `${exportKeyword}type ${name} = Record<string, unknown>;`;
  }

  const properties = entries.map(([key, value]) => {
    const safeKey = isValidIdentifier(key) ? key : `"${key}"`;
    const optional = options.optionalProperties ? '?' : '';
    const readonly = options.readonlyProperties ? 'readonly ' : '';

    let valueType: string;

    // 중첩 객체 처리
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nestedName = toPascalCase(key);
      valueType = nestedName;

      const nestedType = generateTypeAlias(
        nestedName,
        value as Record<string, unknown>,
        options,
        nestedTypes
      );
      nestedTypes.set(nestedName, nestedType);
    }
    // 객체 배열 처리
    else if (Array.isArray(value) && value.length > 0 && value.some(item =>
      item !== null && typeof item === 'object' && !Array.isArray(item)
    )) {
      const nestedName = toPascalCase(key) + 'Item';
      const mergedObject = value.reduce<Record<string, unknown>>((acc, item) => {
        if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
          return { ...acc, ...(item as Record<string, unknown>) };
        }
        return acc;
      }, {});

      const nestedType = generateTypeAlias(
        nestedName,
        mergedObject,
        options,
        nestedTypes
      );
      nestedTypes.set(nestedName, nestedType);
      valueType = `${nestedName}[]`;
    }
    else {
      valueType = inferType(value, options, 0);
    }

    return `  ${readonly}${safeKey}${optional}: ${valueType};`;
  });

  return `${exportKeyword}type ${name} = {\n${properties.join('\n')}\n};`;
}

/**
 * 문자열을 PascalCase로 변환합니다.
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * JSON 문자열을 TypeScript 타입으로 변환합니다.
 */
export function jsonToTypescript(json: string, options: ConversionOptions): ConversionResult {
  try {
    const trimmedJson = json.trim();

    if (!trimmedJson) {
      return {
        success: false,
        output: '',
        error: 'JSON을 입력해주세요.',
      };
    }

    const parsed = JSON.parse(trimmedJson);

    // 최상위가 배열인 경우
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        const exportKeyword = options.exportTypes ? 'export ' : '';
        return {
          success: true,
          output: `${exportKeyword}type ${options.rootName} = unknown[];`,
        };
      }

      // 배열 내 객체가 있는 경우 타입 생성
      const hasObjects = parsed.some(item =>
        item !== null && typeof item === 'object' && !Array.isArray(item)
      );

      if (hasObjects) {
        const mergedObject = parsed.reduce<Record<string, unknown>>((acc, item) => {
          if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
            return { ...acc, ...(item as Record<string, unknown>) };
          }
          return acc;
        }, {});

        const nestedTypes = new Map<string, string>();
        const itemTypeName = options.rootName + 'Item';

        const itemType = options.useInterface
          ? generateInterface(itemTypeName, mergedObject, options, nestedTypes)
          : generateTypeAlias(itemTypeName, mergedObject, options, nestedTypes);

        const exportKeyword = options.exportTypes ? 'export ' : '';
        const rootType = `${exportKeyword}type ${options.rootName} = ${itemTypeName}[];`;

        // 중첩 타입들을 먼저 출력
        const nestedTypesOutput = Array.from(nestedTypes.values()).join('\n\n');
        const output = nestedTypesOutput
          ? `${nestedTypesOutput}\n\n${itemType}\n\n${rootType}`
          : `${itemType}\n\n${rootType}`;

        return {
          success: true,
          output,
        };
      }

      // 프리미티브 배열
      const elementType = inferType(parsed[0], options, 0);
      const exportKeyword = options.exportTypes ? 'export ' : '';
      return {
        success: true,
        output: `${exportKeyword}type ${options.rootName} = ${elementType}[];`,
      };
    }

    // 객체인 경우
    if (typeof parsed === 'object' && parsed !== null) {
      const nestedTypes = new Map<string, string>();

      const rootType = options.useInterface
        ? generateInterface(options.rootName, parsed as Record<string, unknown>, options, nestedTypes)
        : generateTypeAlias(options.rootName, parsed as Record<string, unknown>, options, nestedTypes);

      // 중첩 타입들을 먼저 출력
      const nestedTypesOutput = Array.from(nestedTypes.values()).join('\n\n');
      const output = nestedTypesOutput
        ? `${nestedTypesOutput}\n\n${rootType}`
        : rootType;

      return {
        success: true,
        output,
      };
    }

    // 프리미티브 타입인 경우
    const primitiveType = inferType(parsed, options, 0);
    const exportKeyword = options.exportTypes ? 'export ' : '';
    return {
      success: true,
      output: `${exportKeyword}type ${options.rootName} = ${primitiveType};`,
    };

  } catch (error) {
    return {
      success: false,
      output: '',
      error: error instanceof SyntaxError
        ? '유효하지 않은 JSON 형식입니다.'
        : '변환 중 오류가 발생했습니다.',
    };
  }
}
