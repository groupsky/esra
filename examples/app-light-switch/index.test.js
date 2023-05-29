import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import appFactory from './index.js'

test('turn on from switch 1', () => {
  const app = appFactory()

  const output = app({ topic: 'switch1', payload: true })

  expect(output).toEqual([{ topic: 'light', payload: true }])
})

test('turn off from switch 1', () => {
  const app = appFactory()

  const output = app({ topic: 'switch1', payload: false })

  expect(output).toEqual([{ topic: 'light', payload: false }])
})

test('turn on from switch 2', () => {
  const app = appFactory()

  const output = app({ topic: 'switch2', payload: false })

  expect(output).toEqual([{ topic: 'light', payload: true }])
})

test('turn off from switch 2', () => {
  const app = appFactory()

  const output = app({ topic: 'switch2', payload: true })

  expect(output).toEqual([{ topic: 'light', payload: false }])
})

test('toggle from button 1', () => {
  const app = appFactory()
  let output

  output = app({ topic: 'button1', payload: true })
  expect(output).toEqual([{ topic: 'light', payload: true }])

  output = app({ topic: 'button1', payload: true })
  expect(output).toEqual([{ topic: 'light', payload: false }])
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
