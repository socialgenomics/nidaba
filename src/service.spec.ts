import * as test from 'tape';
import { Test } from 'tape';
import { stub } from 'sinon';
import init from './service';

test('Testing basic service', (t: Test) => {
  async function _test() {

    const _pack = { name: 'nidaba', version: '1' };
    const _iris = { request: stub() as any, register: stub().returns(Promise.resolve()) as any };
    const _irisSetup = stub().returns(Promise.resolve(_iris));
    const irisConfig = { url: 'a', exchange: 'b', namespace: 'nidaba' };
    const _config = { get: stub().returns(irisConfig) } as any;
    const _irisBackend = { register: stub().returns(Promise.resolve()) as any };
    const _irisAMQP = stub().returns(Promise.resolve(_irisBackend));

    t.equals(typeof init, 'function', 'Service exports a function');

    const setupResult = init({ _pack, _irisSetup, _irisAMQP, _config });

    t.ok(setupResult instanceof Promise, 'Service setup must return a promise');

    await setupResult
      .then(() => {
        t.ok(true, 'Yeah, service setup does not blow up');
      })
      .catch(() => {
        t.notOk(true, 'Setup should not blow up at this point');
      });

    t.ok(_iris.register.called, 'Add from iris is called');

    const addCall = _iris.register.getCall(0);

    t.equal(addCall.args[0].pattern, 'status.nidaba', 'The service exposes a status handle');

    const statusImp = addCall.args[0].handler;
    const impResultP = statusImp({});

    t.ok(impResultP instanceof Promise, 'The implementation of status returns a promise');

    await impResultP
      .then((result: any) => {
        t.deepEqual(_pack, result, 'The implementation returns what we expect');
        t.ok(true, 'Implementation does not blow up');
      })
      .catch(() => {
        t.notOk(true, 'Implementation should not blow up');
      });

    const expectedEndpoints = [
      'action.csv.parse.file',
      'action.tsv.parse.file',
      'action.vcf.parse.file'
    ] as any;

    const registeredArray = _irisBackend.register.getCalls().map((x: any) => x.args[0].pattern);

    expectedEndpoints.forEach((x: any) => {
      t.assert(registeredArray.includes(x), `The service exposes a ${x} handle`);
    });

    t.equal(_irisBackend.register.callCount, expectedEndpoints.length, 'The correct number of handles are registered');

    function testEqualArrayContents(a: any, b: any) { return (a.every((x: any) => b.includes(x)) && b.every((x: any) => a.includes(x))); }
    t.assert(testEqualArrayContents(registeredArray, expectedEndpoints), 'All expected handles are registered');

  }

  _test()
    .then(() => t.end())
    .catch(console.error);
});
