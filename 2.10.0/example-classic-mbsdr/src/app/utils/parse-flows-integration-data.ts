import { FlowsResult } from '../models/flows-result';

/**
 * Parte una cadena tipo `toString()` de Java: `[{id=..., name=..., operationType=...}, {...}]`.
 */
function splitJavaStyleList(raw: string): string[] {
  let t = raw.trim();
  if (t.startsWith('[')) {
    t = t.slice(1);
  }
  if (t.endsWith(']')) {
    t = t.slice(0, -1);
  }
  t = t.trim();
  if (!t) {
    return [];
  }
  const chunks = t.split(/\},\s*\{/);
  return chunks.map((chunk) => {
    let c = chunk.trim();
    if (!c.startsWith('{')) {
      c = `{${c}`;
    }
    if (!c.endsWith('}')) {
      c = `${c}}`;
    }
    return c;
  });
}

/**
 * Un mapa `{id=..., name=..., operationType=...}` (claves sin comillas, `=` en lugar de `:`).
 */
function parseJavaStyleEntry(segment: string): Record<string, string> | null {
  let t = segment.trim();
  if (!t.startsWith('{')) {
    t = `{${t}`;
  }
  if (!t.endsWith('}')) {
    t = `${t}}`;
  }
  const inner = t.slice(1, -1);
  const opSep = ', operationType=';
  const opPos = inner.lastIndexOf(opSep);
  if (opPos < 0) {
    return null;
  }
  const operationType = inner.slice(opPos + opSep.length).trim();
  const rest = inner.slice(0, opPos);
  const nameSep = ', name=';
  const namePos = rest.indexOf(nameSep);
  if (namePos < 0) {
    return null;
  }
  const idPart = rest.slice(0, namePos).trim();
  const name = rest.slice(namePos + nameSep.length);
  if (!idPart.startsWith('id=')) {
    return null;
  }
  const id = idPart.slice('id='.length).trim();
  return { id, name, operationType };
}

/**
 * Normaliza `CoreResult.data` de getFlowIntegrationData: array de objetos (iOS / JSON),
 * o string JSON `[{...}]`, o string con formato de lista Java (Android / toString).
 */
export function parseFlowsIntegrationData(data: unknown): FlowsResult[] {
  if (data == null) {
    return [];
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item != null && typeof item === 'object')
      .map((item) => FlowsResult.fromMap(item as Record<string, unknown>));
  }
  if (typeof data !== 'string') {
    return [];
  }
  const s = data.trim();
  if (!s) {
    return [];
  }
  if (s.startsWith('[')) {
    try {
      const parsed: unknown = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return parseFlowsIntegrationData(parsed);
      }
    } catch {
      /* no es JSON válido (p. ej. formato Java id=...) */
    }
    if (s.includes('id=')) {
      return splitJavaStyleList(s)
        .map(parseJavaStyleEntry)
        .filter((row): row is Record<string, string> => row !== null)
        .map((row) => FlowsResult.fromMap(row));
    }
  }
  return [];
}
