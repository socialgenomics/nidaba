import { delimiter } from 'path';
import { PassThrough } from 'stream';
import { map } from 'ramda';
import * as parseCSV from 'csv-parse';

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
  const parser = parseCSV(request.payload.file, { delimiter: '\t', columns: true }, (err: any, data: any) => {
    data.forEach((o: any) => {
      const split = (x: string) => x.split(',');
      res.push(map(split, o));
    });
  });
  return res;
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
