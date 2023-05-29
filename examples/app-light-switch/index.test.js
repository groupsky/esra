import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import appFactory from './index.js'

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.restoreAllMocks()
})

test('initial state', () => {
  const app = appFactory()

  const output = app({ topic: 'switch1', payload: { state: true } })

  expect(output).toEqual([{ topic: 'light', payload: 'on' }])
})
