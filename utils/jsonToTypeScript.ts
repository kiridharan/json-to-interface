function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getType(value: any): string {
  if (Array.isArray(value)) {
    const itemType = value.length > 0 ? getType(value[0]) : 'any';
    return `${itemType}[]`;
  } else if (typeof value === 'object' && value !== null) {
    return capitalizeFirstLetter(Object.keys(value)[0] || 'Object');
  } else {
    return typeof value;
  }
}

function generateInterface(obj: any, interfaceName: string): string {
  let output = `interface ${interfaceName} {\n`;
  for (const [key, value] of Object.entries(obj)) {
    const type = getType(value);
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      output += `  ${key}: ${capitalizeFirstLetter(key)};\n`;
    } else {
      output += `  ${key}: ${type};\n`;
    }
  }
  output += '}\n\n';

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      output += generateInterface(value, capitalizeFirstLetter(key));
    }
  }

  return output;
}

function preprocessJson(input: string): string {
  // Remove leading/trailing whitespace
  let processed = input.trim();

  // Remove wrapping curly braces if present
  if (processed.startsWith('{') && processed.endsWith('}')) {
    processed = processed.slice(1, -1).trim();
  }

  // Replace single quotes with double quotes
  processed = processed.replace(/'/g, '"');

  // Add quotes to unquoted keys
  processed = processed.replace(/(\w+)(?=\s*:)/g, '"$1"');

  // Wrap the processed JSON in curly braces
  return `{${processed}}`;
}

export function convertJsonToTypeScript(jsonString: string, interfaceName: string = 'RootObject'): string {
  try {
    const preprocessedJson = preprocessJson(jsonString);
    const jsonObject = JSON.parse(preprocessedJson);
    return generateInterface(jsonObject, interfaceName);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return `Error: Invalid JSON\n${error.message}`;
    }
    return `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`;
  }
}

