import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import appFactory from './index.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('locked is always on', () => {
  const app = appFactory()
  let output

  output = app({ topic: 'lock', payload: true })
  expect(output).toEqual([{ topic: 'light', payload: true }])

  output = app({ topic: 'button1', payload: true })
  expect(output).toEqual([])

  output = app({ topic: 'button1', payload: true })
  expect(output).toEqual([])

  output = app({ topic: 'switch1', payload: false })
  expect(output).toEqual([])

  output = app({ topic: 'switch2', payload: true })
  expect(output).toEqual([])

  output = app({ topic: 'lock', payload: false })
  expect(output).toEqual([{ topic: 'light', payload: false }])
})

test.only('open door turns on light for 5 minutes', () => {
  const app = appFactory()
  let output

  output = app({ topic: 'door', payload: true })
  expect(output).toEqual([{ topic: 'light', payload: true }])

  vi.advanceTimersByTime(1000 * 60 * 3)
  output = app()
  expect(output).toEqual([])

  vi.advanceTimersByTime(1000 * 60 * 2)
  output = app()
  expect(output).toEqual([{ topic: 'light', payload: false }])
})
