import { delimiter } from 'path';
import { PassThrough } from 'stream';
import { map } from 'ramda';
import * as _parseCSV from 'csv-parse';

// Custom promisification of the csv parser
function parseCSV(fileContent: string, opts: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    _parseCSV(fileContent, opts, (err: Error | undefined, data: any) => {
      if (err) {
        if (err.message === 'Invalid data argument: undefined') {
          err.message = 'No valid input file found! - Re-try upload or check file for errors.';
        }
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function query(payload: any): Promise<any> {
  const data = await parseCSV(payload, { delimiter: '\t', columns: true });
  return data.map((v: any, i: number) => {
    const split = (x: string) => x.split(',').map(s => s.trim());
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
