export type CategoryId = 'army' | 'torah' | 'law' | 'state' | 'business' | 'general' | 'edu' | 'health' | 'units'

export interface Meaning {
  text: string
  category: CategoryId
}

export interface Acronym {
  acronym: string
  key: string
  meanings: Meaning[]
}

export interface LookupResult extends Acronym {
  prefix: string
}

export interface FoundAcronym {
  match: string
  index: number
  entry: LookupResult
}

export interface SearchOptions {
  category?: CategoryId
  limit?: number
}

export interface ExpandOptions {
  ambiguous?: 'keep' | 'first'
}

export declare const acronyms: Acronym[]
export declare const categories: { id: CategoryId; label: string }[]
export declare function normalize(value: string): string
export declare function lookup(word: string): LookupResult | null
export declare function search(query: string, options?: SearchOptions): Acronym[]
export declare function expand(text: string, options?: ExpandOptions): string
export declare function findAcronyms(text: string): FoundAcronym[]
export declare function categoryLabel(id: CategoryId): string
