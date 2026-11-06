import { acronyms as rawAcronyms } from './data.js'

export const categories = [
  { id: 'army', label: 'צבא וביטחון' },
  { id: 'torah', label: 'תורה, הלכה וחכמים' },
  { id: 'law', label: 'משפט וחוק' },
  { id: 'state', label: 'מדינה, ציבור ותחבורה' },
  { id: 'business', label: 'עסקים וכסף' },
  { id: 'general', label: 'כתיבה וכללי' },
  { id: 'edu', label: 'לימודים ותארים' },
  { id: 'health', label: 'רפואה ומדע' },
  { id: 'units', label: 'מידות ומקומות' },
]

const NIKUD = /[֑-ׇ]/g
const QUOTE_MARKS = /["'`׳״‘’“”]/g
const PUNCTUATION = /[.\-־_]/g
const PREFIX_LETTERS = 'ובהלמשכ'
const MAX_PREFIX = 3
const TOKEN = /[א-ת"'׳״’”]+/g
const INNER_GERSHAYIM = /[א-ת]["״”][א-ת]/
const FINAL_GERESH = /[א-ת]['׳’]$/

export function normalize(value) {
  return String(value ?? '')
    .replace(NIKUD, '')
    .replace(QUOTE_MARKS, '')
    .replace(PUNCTUATION, '')
    .replace(/\s+/g, '')
}

export const acronyms = rawAcronyms.map((entry) => ({ ...entry, key: normalize(entry.acronym) }))

const byKey = new Map()
for (const entry of acronyms) {
  const existing = byKey.get(entry.key)
  if (existing) {
    for (const meaning of entry.meanings) {
      if (!existing.meanings.some((item) => item.text === meaning.text)) existing.meanings.push(meaning)
    }
  } else {
    byKey.set(entry.key, { ...entry, meanings: [...entry.meanings] })
  }
}

const prefixSplits = (key) => {
  const splits = []
  for (let length = 1; length <= MAX_PREFIX && length < key.length - 1; length += 1) {
    const prefix = key.slice(0, length)
    if ([...prefix].every((letter) => PREFIX_LETTERS.includes(letter))) splits.push([prefix, key.slice(length)])
  }
  return splits
}

export function lookup(word) {
  const key = normalize(word)
  if (!key) return null
  const exact = byKey.get(key)
  if (exact) return { ...exact, prefix: '' }
  for (const [prefix, rest] of prefixSplits(key)) {
    const entry = byKey.get(rest)
    if (entry) return { ...entry, prefix }
  }
  return null
}

const phraseOf = (value) =>
  String(value ?? '')
    .replace(NIKUD, '')
    .replace(QUOTE_MARKS, '')
    .replace(/\s+/g, ' ')
    .trim()

const scoreOf = (entry, key, phrase) => {
  if (entry.key === key) return 0
  if (entry.key.startsWith(key)) return 1
  const matches = entry.meanings.some((meaning) => {
    const text = phraseOf(meaning.text)
    return text.includes(phrase) || text.split(' ').some((word) => word.startsWith(phrase))
  })
  return matches ? 2 : -1
}

export function search(query, options = {}) {
  const { category, limit = 20 } = options
  const pool = [...byKey.values()]
    .map((entry) =>
      category ? { ...entry, meanings: entry.meanings.filter((meaning) => meaning.category === category) } : entry,
    )
    .filter((entry) => entry.meanings.length > 0)
  const key = normalize(query)
  if (!key) return pool.slice(0, limit)
  const phrase = phraseOf(query)
  return pool
    .map((entry) => ({ entry, score: scoreOf(entry, key, phrase) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => a.score - b.score || a.entry.key.localeCompare(b.entry.key, 'he'))
    .slice(0, limit)
    .map((item) => item.entry)
}

const looksLikeAcronym = (token) => INNER_GERSHAYIM.test(token) || FINAL_GERESH.test(token)

const spokenForm = (meaning) => meaning.text.split(',')[0].trim()

const spokenPrefix = (prefix) => (prefix.endsWith('ה') ? prefix.slice(0, -1) : prefix)

export function expand(text, options = {}) {
  const { ambiguous = 'keep' } = options
  return String(text ?? '').replace(TOKEN, (token) => {
    const leading = /^["'”’]*/.exec(token)[0]
    const trailing = /["”]*$/.exec(token.slice(leading.length))[0]
    const core = token.slice(leading.length, token.length - trailing.length)
    if (!looksLikeAcronym(core)) return token
    const entry = lookup(core)
    if (!entry) return token
    if (entry.meanings.length > 1 && ambiguous !== 'first') return token
    return `${leading}${spokenPrefix(entry.prefix)}${spokenForm(entry.meanings[0])}${trailing}`
  })
}

export function findAcronyms(text) {
  const found = []
  for (const match of String(text ?? '').matchAll(TOKEN)) {
    const core = match[0].replace(/^["'”’]+/, '').replace(/["”]+$/, '')
    if (!looksLikeAcronym(core)) continue
    const entry = lookup(core)
    if (entry) found.push({ match: core, index: match.index + match[0].indexOf(core), entry })
  }
  return found
}

export const categoryLabel = (id) => categories.find((category) => category.id === id)?.label ?? ''
