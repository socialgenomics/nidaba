import irisSetup from '@repositive/iris';
import { IrisAMQP } from '@repositive/iris';
import * as config from 'config';
import { readFileSync } from 'fs';

export async function run() {
const iris = await IrisAMQP({ uri: 'amqp://guest:guest@localhost', namespace: 'nidaba'});
const file = readFileSync('assets/out.tsv');
const payload = file;
const parsed = await iris.request({ pattern: 'action.csv.parse.file', payload }).catch((err: Error) => console.log(err));
const res = parsed || '';
return res.toString();
}

run().then((d: any) => { console.log(d); process.exit(0); });
