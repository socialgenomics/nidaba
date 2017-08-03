import * as test from 'tape';
import { Test } from 'tape';
import { query } from './parse';
import { readFileSync } from 'fs';

test('Parse an empty file', async (t: Test) => {
  const req = {
    payload: {
      file: readFileSync('assets/empty.tsv')
    }
  };
  const res = await query({request: req});
  t.assert(Array.isArray(res), 'The service returns an array');
  t.assert(res.length === 0, 'The array is empty');
  t.end();
});

test('Return errors on no file', async (t: Test) => {
  t.plan(3);
  const req = {
    payload: {}
  };
  const res = await query({request: req}).catch(err => {
    t.assert(err, 'Throw an error for broken files');
    t.equals(err.message, 'No valid input file found!', 'Check for correct error message');
  });
  t.false(res, 'The service returns no result');
});

test('Parse an empty file with headers', async (t: Test) => {
  const req = {
    payload: {
      file: readFileSync('assets/headers-only.tsv')
    }
  };
  const res = await query({request: req});
  t.assert(Array.isArray(res), 'The service returns an array');
  t.assert(res.length === 0, 'The array is empty');
  t.end();
});

test('Parse a correctly formatted file with models', async (t: Test) => {
  const req = {
    payload: {
      file: readFileSync('assets/out-10-Wed Aug 02 2017.tsv')
    }
  };
  const res = await query({request: req});
  t.assert(Array.isArray(res), 'The service returns an array');
  t.assert(res.length === 10, 'The number of models is as expected');
  t.end();
});

test('Handle broken files with appropriate errors', async (t: Test) => {
  t.plan(3);
  const req = {
    payload: {
      file: readFileSync('assets/broken-10.tsv')
    }
  };
  const res = await query({request: req}).catch(err => {
    t.assert(err, 'Throw an error for broken files');
    t.equals(err.message, 'Invalid closing quote at line 3; found " " instead of delimiter "\\t"', 'Check for correct message');
  });
  t.false(res, 'Don\'t return value on error');
});
