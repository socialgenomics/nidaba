import irisSetup from '@repositive/iris';
import {LibOpts} from '@repositive/iris';
import * as config from 'config';
import parse from './parse';

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
  const irisOpts = _config.get<LibOpts<any>>('iris');

  const iris = await _irisSetup(irisOpts);

  iris.register({pattern: `status.${irisOpts.namespace}`, async handler(msg: any) {
    return {
      name: _pack.name,
      version: _pack.version
    };
  }});

  iris.register<any, any>({pattern: `action.csv.parse`, handler: _parse});

  // iris.register<any, any>({pattern: `action.${irisOpts.namespace}.add`, handler: _add});

}
