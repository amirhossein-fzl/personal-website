import { describe, it, expect } from 'vitest'
import { pick, omit } from '../../../utils'

describe('pick', () => {
  it('picks a single key from an object', () => {
    const data = { a: 1, b: 2, c: 3 }
    expect(pick(data, ['a'])).toEqual({ a: 1 })
  })

  it('picks multiple keys from an object', () => {
    const data = { a: 1, b: 2, c: 3 }
    expect(pick(data, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('returns an empty object when keys array is empty', () => {
    const data = { a: 1, b: 2 }
    expect(pick(data, [])).toEqual({})
  })

  it('returns all keys when all are picked', () => {
    const data = { a: 1, b: 2 }
    expect(pick(data, ['a', 'b'])).toEqual({ a: 1, b: 2 })
  })

  it('does not mutate the original object', () => {
    const data = { a: 1, b: 2, c: 3 }
    const snapshot = { ...data }
    pick(data, ['a', 'b'])
    expect(data).toEqual(snapshot)
  })

  it('returns a new object (not the same reference)', () => {
    const data = { a: 1, b: 2 }
    const result = pick(data, ['a'])
    expect(result).not.toBe(data)
  })

  it('preserves values including falsy ones (null, undefined, 0, false, "")', () => {
    const data = { a: null, b: undefined, c: 0, d: false, e: '' }
    expect(pick(data, ['a', 'b', 'c', 'd', 'e'])).toEqual({
      a: null,
      b: undefined,
      c: 0,
      d: false,
      e: '',
    })
  })

  it('works with nested object references', () => {
    const nested = { x: 1 }
    const data = { a: nested, b: 2 }
    const result = pick(data, ['a'])
    expect(result.a).toBe(nested)
  })

  it('works with symbol keys', () => {
    const sym = Symbol('key')
    const data = { a: 1, [sym]: 'sym-value' }
    const result = pick(data, [sym])
    expect(result[sym]).toBe('sym-value')
    expect('a' in result).toBe(false)
  })

  it('handles duplicate keys in the keys array', () => {
    const data = { a: 1, b: 2 }
    expect(pick(data, ['a', 'a', 'b'])).toEqual({ a: 1, b: 2 })
  })

  it('works with class instances', () => {
    class Point {
      constructor(public x: number, public y: number) {}
    }
    const point = new Point(1, 2)
    const result = pick(point, ['x'])
    expect(result).toEqual({ x: 1 })
  })
})

describe('omit', () => {
  it('omits a single key from an object', () => {
    const data = { a: 1, b: 2, c: 3 }
    expect(omit(data, ['a'])).toEqual({ b: 2, c: 3 })
  })

  it('omits multiple keys from an object', () => {
    const data = { a: 1, b: 2, c: 3 }
    expect(omit(data, ['a', 'c'])).toEqual({ b: 2 })
  })

  it('returns a copy when keys array is empty', () => {
    const data = { a: 1, b: 2 }
    expect(omit(data, [])).toEqual({ a: 1, b: 2 })
  })

  it('returns an empty object when all keys are omitted', () => {
    const data = { a: 1, b: 2 }
    expect(omit(data, ['a', 'b'])).toEqual({})
  })

  it('does not mutate the original object', () => {
    const data = { a: 1, b: 2, c: 3 }
    const snapshot = { ...data }
    omit(data, ['a', 'b'])
    expect(data).toEqual(snapshot)
  })

  it('returns a new object (not the same reference)', () => {
    const data = { a: 1, b: 2 }
    const result = omit(data, ['a'])
    expect(result).not.toBe(data)
  })

  it('silently ignores keys that do not exist', () => {
    const data = { a: 1 } as { a: number; b?: number }
    expect(omit(data, ['b' as 'a'])).toEqual({ a: 1 })
  })

  it('handles duplicate keys in the keys array', () => {
    const data = { a: 1, b: 2, c: 3 }
    expect(omit(data, ['a', 'a'])).toEqual({ b: 2, c: 3 })
  })

  it('preserves values including falsy ones for non-omitted keys', () => {
    const data = { a: null, b: 0, c: false, d: '' }
    expect(omit(data, ['a'])).toEqual({ b: 0, c: false, d: '' })
  })

  it('keeps nested object references intact', () => {
    const nested = { x: 1 }
    const data = { a: nested, b: 2 }
    const result = omit(data, ['b'])
    expect(result.a).toBe(nested)
  })

  it('performs a shallow copy (nested objects are shared)', () => {
    const nested = { x: 1 }
    const data = { a: nested, b: 2 }
    const result = omit(data, ['b'])
    result.a.x = 999
    expect(nested.x).toBe(999)
  })
})

describe('pick + omit round-trip', () => {
  it('pick followed by omit of the same keys yields empty object', () => {
    const data = { a: 1, b: 2, c: 3 }
    const picked = pick(data, ['a', 'b'])
    expect(omit(picked, ['a', 'b'])).toEqual({})
  })

  it('omit then pick reconstructs the original subset', () => {
    const data = { a: 1, b: 2, c: 3 }
    const omitted = omit(data, ['c'])
    expect(pick(omitted, ['a', 'b'])).toEqual({ a: 1, b: 2 })
  })
})