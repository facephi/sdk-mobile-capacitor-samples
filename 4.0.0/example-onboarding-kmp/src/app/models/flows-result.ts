/** Mismos campos que `FlowsResult` en el ejemplo Flutter: id, name, operationType. */
export class FlowsResult 
{
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly operationType: string
  ) {}

  static fromMap(map: Record<string, unknown>): FlowsResult {
    return new FlowsResult(
      map['id'] != null ? String(map['id']) : '',
      map['name'] != null ? String(map['name']) : '',
      map['operationType'] != null ? String(map['operationType']) : ''
    );
  }
}
