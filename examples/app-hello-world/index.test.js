import { expect, test } from 'vitest'
import appFactory from './index.js'

test('returns hello world with payload and topic', () => {
  const app = appFactory()

  const output = app({ topic: '/hello', payload: 'world' })

  expect(output).toEqual([{ topic: '/hello', payload: 'hello world from /hello' }])
})

test('clears output after each call', () => {
  const app = appFactory()

  app({ topic: '/hello', payload: 'world' })
  const output = app({ topic: '/hello', payload: 'there' })

  expect(output).toEqual([{ topic: '/hello', payload: 'hello there from /hello' }])
})
