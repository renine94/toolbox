export interface ParseResult {
  success: boolean;
  data: unknown;
  error?: string;
}

export interface PhpObject {
  __php_class__: string;
  [key: string]: unknown;
}

class PhpUnserializerParser {
  private input: string;
  private position: number;

  constructor(input: string) {
    this.input = input.trim();
    this.position = 0;
  }

  public parse(): ParseResult {
    try {
      if (!this.input) {
        throw new Error('Empty input');
      }
      const data = this.parseValue();
      if (this.position < this.input.length) {
        const remaining = this.input.substring(this.position, this.position + 20);
        throw new Error(`Unexpected data at position ${this.position}: "${remaining}..."`);
      }
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown parsing error',
      };
    }
  }

  private parseValue(): unknown {
    if (this.position >= this.input.length) {
      throw new Error('Unexpected end of input');
    }

    const type = this.input[this.position];

    switch (type) {
      case 'N':
        return this.parseNull();
      case 'b':
        return this.parseBoolean();
      case 'i':
        return this.parseInteger();
      case 'd':
        return this.parseDouble();
      case 's':
        return this.parseString();
      case 'a':
        return this.parseArray();
      case 'O':
        return this.parseObject();
      case 'C':
        return this.parseCustomObject();
      case 'R':
      case 'r':
        return this.parseReference();
      default:
        throw new Error(`Unknown type '${type}' at position ${this.position}`);
    }
  }

  private parseNull(): null {
    this.expect('N;');
    return null;
  }

  private parseBoolean(): boolean {
    this.expect('b:');
    const value = this.input[this.position] === '1';
    this.position++;
    this.expect(';');
    return value;
  }

  private parseInteger(): number {
    this.expect('i:');
    const end = this.input.indexOf(';', this.position);
    if (end === -1) {
      throw new Error(`Missing semicolon for integer at position ${this.position}`);
    }
    const valueStr = this.input.substring(this.position, end);
    const value = parseInt(valueStr, 10);
    if (isNaN(value)) {
      throw new Error(`Invalid integer value "${valueStr}" at position ${this.position}`);
    }
    this.position = end + 1;
    return value;
  }

  private parseDouble(): number {
    this.expect('d:');
    const end = this.input.indexOf(';', this.position);
    if (end === -1) {
      throw new Error(`Missing semicolon for double at position ${this.position}`);
    }
    const valueStr = this.input.substring(this.position, end);

    // Handle special values
    if (valueStr === 'INF') {
      this.position = end + 1;
      return Infinity;
    }
    if (valueStr === '-INF') {
      this.position = end + 1;
      return -Infinity;
    }
    if (valueStr === 'NAN') {
      this.position = end + 1;
      return NaN;
    }

    const value = parseFloat(valueStr);
    if (isNaN(value) && valueStr !== 'NAN') {
      throw new Error(`Invalid double value "${valueStr}" at position ${this.position}`);
    }
    this.position = end + 1;
    return value;
  }

  private parseString(): string {
    this.expect('s:');
    const lengthEnd = this.input.indexOf(':', this.position);
    if (lengthEnd === -1) {
      throw new Error(`Missing colon for string length at position ${this.position}`);
    }
    const length = parseInt(this.input.substring(this.position, lengthEnd), 10);
    if (isNaN(length) || length < 0) {
      throw new Error(`Invalid string length at position ${this.position}`);
    }
    this.position = lengthEnd + 1;
    this.expect('"');

    // Handle multi-byte characters properly
    const value = this.input.substring(this.position, this.position + length);
    this.position += length;
    this.expect('";');
    return value;
  }

  private parseArray(): unknown[] | Record<string, unknown> {
    this.expect('a:');
    const countEnd = this.input.indexOf(':', this.position);
    if (countEnd === -1) {
      throw new Error(`Missing colon for array count at position ${this.position}`);
    }
    const count = parseInt(this.input.substring(this.position, countEnd), 10);
    if (isNaN(count) || count < 0) {
      throw new Error(`Invalid array count at position ${this.position}`);
    }
    this.position = countEnd + 1;
    this.expect('{');

    const result: Record<string, unknown> = {};
    const arrayResult: unknown[] = [];
    let isSequential = true;
    let expectedIndex = 0;

    for (let i = 0; i < count; i++) {
      const key = this.parseValue();
      const value = this.parseValue();

      if (typeof key === 'number') {
        if (key !== expectedIndex) {
          isSequential = false;
        }
        expectedIndex = key + 1;
        arrayResult[key] = value;
      } else {
        isSequential = false;
      }
      result[String(key)] = value;
    }

    this.expect('}');

    // Return as array if keys are sequential integers starting from 0
    if (isSequential && Object.keys(result).length === count) {
      return arrayResult;
    }
    return result;
  }

  private parseObject(): PhpObject {
    this.expect('O:');
    const lengthEnd = this.input.indexOf(':', this.position);
    if (lengthEnd === -1) {
      throw new Error(`Missing colon for class name length at position ${this.position}`);
    }
    const classNameLength = parseInt(this.input.substring(this.position, lengthEnd), 10);
    if (isNaN(classNameLength) || classNameLength < 0) {
      throw new Error(`Invalid class name length at position ${this.position}`);
    }
    this.position = lengthEnd + 1;
    this.expect('"');
    const className = this.input.substring(this.position, this.position + classNameLength);
    this.position += classNameLength;
    this.expect('":');

    const countEnd = this.input.indexOf(':', this.position);
    if (countEnd === -1) {
      throw new Error(`Missing colon for property count at position ${this.position}`);
    }
    const count = parseInt(this.input.substring(this.position, countEnd), 10);
    if (isNaN(count) || count < 0) {
      throw new Error(`Invalid property count at position ${this.position}`);
    }
    this.position = countEnd + 1;
    this.expect('{');

    const result: PhpObject = { __php_class__: className };

    for (let i = 0; i < count; i++) {
      const key = this.parseValue() as string;
      const value = this.parseValue();
      const cleanKey = this.cleanPropertyName(key);
      result[cleanKey] = value;
    }

    this.expect('}');
    return result;
  }

  private parseCustomObject(): PhpObject {
    // Custom serializable objects: C:length:"classname":dataLength:{data}
    this.expect('C:');
    const lengthEnd = this.input.indexOf(':', this.position);
    if (lengthEnd === -1) {
      throw new Error(`Missing colon for class name length at position ${this.position}`);
    }
    const classNameLength = parseInt(this.input.substring(this.position, lengthEnd), 10);
    this.position = lengthEnd + 1;
    this.expect('"');
    const className = this.input.substring(this.position, this.position + classNameLength);
    this.position += classNameLength;
    this.expect('":');

    const dataLengthEnd = this.input.indexOf(':', this.position);
    if (dataLengthEnd === -1) {
      throw new Error(`Missing colon for data length at position ${this.position}`);
    }
    const dataLength = parseInt(this.input.substring(this.position, dataLengthEnd), 10);
    this.position = dataLengthEnd + 1;
    this.expect('{');
    const data = this.input.substring(this.position, this.position + dataLength);
    this.position += dataLength;
    this.expect('}');

    return {
      __php_class__: className,
      __serialized_data__: data,
    };
  }

  private parseReference(): string {
    const type = this.input[this.position];
    this.position++;
    this.expect(':');
    const end = this.input.indexOf(';', this.position);
    if (end === -1) {
      throw new Error(`Missing semicolon for reference at position ${this.position}`);
    }
    const index = this.input.substring(this.position, end);
    this.position = end + 1;
    return `[${type === 'R' ? 'Reference' : 'Object Reference'} #${index}]`;
  }

  private cleanPropertyName(name: string): string {
    // PHP private properties: \0ClassName\0propertyName
    // PHP protected properties: \0*\0propertyName
    if (name.includes('\0')) {
      const parts = name.split('\0');
      return parts[parts.length - 1];
    }
    return name;
  }

  private expect(str: string): void {
    if (!this.input.startsWith(str, this.position)) {
      const found = this.input.substring(this.position, this.position + Math.max(str.length, 10));
      throw new Error(`Expected '${str}' at position ${this.position}, found '${found}'`);
    }
    this.position += str.length;
  }
}

export function unserialize(input: string): ParseResult {
  const parser = new PhpUnserializerParser(input);
  return parser.parse();
}

export function formatOutput(data: unknown, indent: number = 2): string {
  return JSON.stringify(data, null, indent);
}
