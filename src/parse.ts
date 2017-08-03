import { delimiter } from 'path';
import { PassThrough } from 'stream';
import { map } from 'ramda';
import * as _parseCSV from 'csv-parse';

// Custom promisification of the csv parser
function parseCSV(fileContent: string, opts: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    _parseCSV(fileContent, opts, (err: Error | undefined, data: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function query({
  request
}: {
    request: any
  }): Promise<any> {
  // TODO: Define error handling
  if (!request.payload.file) {
    return [];
  }
  const res: any[] = [];
  const data = await parseCSV(request.payload.file, { delimiter: '\t', columns: true });
  return data.map((v: any, i: number) => {
    const split = (x: string) => x.split(',');
    return map(split, v);
  });
}

export default function parse({
  payload,
  _query = query
}: {
    payload: any,
    _query?: typeof query
  }) {
  return _query(payload);
}
