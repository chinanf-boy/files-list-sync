import test from 'ava';
import m from './files-list-sync';

test('sync: deep all', t => {
  const results = m('.', { deep: 'all' });
  console.log(results.length);
  t.true(results.length > 12);
});

test('sync: that repo path dir', t => {
  const results = m('.');
  t.true(results.length >= 10);
});

test('sync: that repo path test.js', t => {
  const results = m('./test.js');
  t.true(results.length === 1);
});
