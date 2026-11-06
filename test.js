import { test } from 'node:test'
import assert from 'node:assert/strict'
import { acronyms, expand, findAcronyms, lookup, normalize, search } from './index.js'

test('dictionary is loaded', () => {
  assert.ok(acronyms.length > 400)
})

test('normalize strips gershayim, ascii quotes and nikud', () => {
  assert.equal(normalize('צה״ל'), 'צהל')
  assert.equal(normalize('צה"ל'), 'צהל')
  assert.equal(normalize('צַה״ל'), 'צהל')
})

test('lookup finds an acronym with or without a prefix', () => {
  assert.equal(lookup('צה״ל').meanings[0].text, 'צבא הגנה לישראל')
  assert.equal(lookup('ובצה"ל').prefix, 'וב')
  assert.equal(lookup('שלום'), null)
})

test('expand turns acronyms into words for speech', () => {
  assert.equal(expand('הדו״ח של רו״ח'), 'דין וחשבון של רואה חשבון')
  assert.equal(expand('מחיר כולל מע"מ'), 'מחיר כולל מס ערך מוסף')
})

test('expand keeps quoted ordinary words', () => {
  assert.equal(expand('ראו "אמן"'), 'ראו "אמן"')
})

test('expand keeps ambiguous acronyms unless asked', () => {
  assert.equal(expand('ב״ב'), 'ב״ב')
  assert.notEqual(expand('ב״ב', { ambiguous: 'first' }), 'ב״ב')
})

test('findAcronyms reports positions', () => {
  const found = findAcronyms('חברה בע״מ')
  assert.equal(found.length, 1)
  assert.equal(found[0].index, 5)
})

test('search matches the acronym and the meaning', () => {
  assert.equal(search('מנכ')[0].acronym, 'מנכ״ל')
  assert.ok(search('מס ערך').some((entry) => entry.acronym === 'מע״מ'))
})
