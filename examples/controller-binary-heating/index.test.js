import { expect, test } from 'vitest'
import controller from './index.js'

const configuration = {
  targetValue: 20,
  onHysteresis: 1,
  offHysteresis: 2,
}

test('turns on when temperature is below target', () => {
  const result = controller({ ...configuration, currentValue: 10, lastOutput: false })
  expect(result).toEqual(true)
})

test('turns off when temperature is above target', () => {
  const result = controller({ ...configuration, currentValue: 30, lastOutput: true })
  expect(result).toEqual(false)
})

test('keeps off when temperature is above threshold', () => {
  const result = controller({ ...configuration, currentValue: 19.5, lastOutput: false })
  expect(result).toEqual(false)
})

test('keeps off when temperature is at threshold', () => {
  const result = controller({ ...configuration, currentValue: 19, lastOutput: false })
  expect(result).toEqual(false)
})

test('turns on when temperature is bellow threshold', () => {
  const result = controller({ ...configuration, currentValue: 18.5, lastOutput: false })
  expect(result).toEqual(true)
})

test('keeps on when temperature is bellow threshold', () => {
  const result = controller({ ...configuration, currentValue: 21, lastOutput: true })
  expect(result).toEqual(true)
})

test('keeps on when temperature is at threshold', () => {
  const result = controller({ ...configuration, currentValue: 22, lastOutput: true })
  expect(result).toEqual(true)
})

test('turns off when temperature is above threshold', () => {
  const result = controller({ ...configuration, currentValue: 23, lastOutput: true })
  expect(result).toEqual(false)
})
