import irisSetup from '@repositive/iris';
import { IrisAMQP } from '@repositive/iris';
import * as config from 'config';
import parse from './parse';
import { pipeP } from 'ramda';

const pack = require('../package.json');

export default async function init({
  _config = config,
  _irisSetup = irisSetup,
  _parse = parse,
  _pack = pack
}: {
  _config?: typeof config,
  _irisSetup?: typeof irisSetup,
  _parse?: typeof parse,
  _pack?: {version: string}
}): Promise<void> {
  const irisOpts = _config.get<any>('iris');
  const iris = await _irisSetup(irisOpts);
  const irisBackend = await IrisAMQP(irisOpts);

  iris.register({pattern: `status.${irisOpts.namespace}`, async handler(msg: any) {
    return {
      name: _pack.name,
      version: _pack.version
    };
  }});

  irisBackend.register({pattern: `action.csv.parse.file`, async handler({payload}) {
    const res = await _parse({payload: payload.toString()});
    console.log(typeof res);
    return Buffer.from(JSON.stringify(res));
  }});

}