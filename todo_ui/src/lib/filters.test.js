import { describe, it, expect } from 'vitest'
import { FILTERS, applyFilter, remainingCount } from './filters.js'

const sample = [
  { id: 1, title: 'Rust 설치', completed: false },
  { id: 2, title: 'wasm-pack 빌드', completed: true },
  { id: 3, title: 'UI 구현', completed: false },
]

describe('FILTERS', () => {
  it('정의된 필터 목록을 유지한다', () => {
    expect(FILTERS).toEqual(['all', 'active', 'done'])
  })
})

describe('applyFilter', () => {
  it('기본값은 전체 목록을 반환한다', () => {
    expect(applyFilter(sample)).toEqual(sample)
  })

  it('active 필터는 미완료 항목만 반환한다', () => {
    const active = applyFilter(sample, 'active')
    expect(active).toEqual([
      { id: 1, title: 'Rust 설치', completed: false },
      { id: 3, title: 'UI 구현', completed: false },
    ])
  })

  it('done 필터는 완료 항목만 반환한다', () => {
    const done = applyFilter(sample, 'done')
    expect(done).toEqual([{ id: 2, title: 'wasm-pack 빌드', completed: true }])
  })

  it('알 수 없는 필터는 전체를 반환한다', () => {
    expect(applyFilter(sample, 'unknown')).toEqual(sample)
  })
})

describe('remainingCount', () => {
  it('완료되지 않은 항목 수를 반환한다', () => {
    expect(remainingCount(sample)).toBe(2)
  })

  it('빈 배열에서는 0을 반환한다', () => {
    expect(remainingCount([])).toBe(0)
  })
})

