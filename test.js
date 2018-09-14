import test from 'ava';
import m from './files-list-sync';

test('sync: deep all', t => {
  let results = m('.', { deep: 'all' });
  console.log(results.length);
  t.true(results.length > 12);
});

test('sync: that repo path dir', t => {
  let results = m('.');
  t.true(results.length >= 10);
});

test('sync: that repo path test.js', t => {
  let results = m('./test.js');
  t.true(results.length === 1);
});
