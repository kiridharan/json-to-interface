"use server";

import { convertJsonToTypeScript } from "../utils/jsonToTypeScript";

export async function convertJson(
  jsonString: string,
  interfaceName: string
): Promise<{ result: string }> {
  const result = convertJsonToTypeScript(jsonString, interfaceName);
  return { result };
}
