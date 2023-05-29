import { expect, test } from 'vitest'
import appFactory from './index.js'

test.only('returns first payload', () => {
  const app = appFactory()

  const output = app({ topic: 'sum', payload: 1 })

  expect(output).toEqual([{ topic: 'result', payload: 1 }])
})

test('returns sum of first and second payload', () => {
  const app = appFactory()

  app({ topic: 'sum', payload: 1 })
  const output = app({ topic: 'sum', payload: 2 })

  expect(output).toEqual([{ topic: 'result', payload: 3 }])
})
