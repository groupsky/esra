import { expect, test } from 'vitest'
import { processRunner } from '../../index.js'
import controller from './index.js'

const configuration = {
  targetValue: 20,
  onHysteresis: 1,
  offHysteresis: 2,
}

test('turns on when temperature is below target', () => {
  const runner = processRunner(controller)

  const result = runner({ ...configuration, currentValue: 10 })

  expect(result).toEqual(true)
})

test('turns off when temperature is above target', () => {
  const runner = processRunner(controller)

  runner({ ...configuration, currentValue: 10 })
  const result = runner({ ...configuration, currentValue: 30 })

  expect(result).toEqual(false)
})

test('keeps off when temperature is above threshold', () => {
  const runner = processRunner(controller)

  const result = runner({ ...configuration, currentValue: 19.5 })

  expect(result).toEqual(false)
})

test('keeps off when temperature is at threshold', () => {
  const runner = processRunner(controller)

  const result = runner({ ...configuration, currentValue: 19 })

  expect(result).toEqual(false)
})

test('turns on when temperature is bellow threshold', () => {
  const runner = processRunner(controller)

  const result = runner({ ...configuration, currentValue: 18.5 })

  expect(result).toEqual(true)
})

test('keeps on when temperature is bellow threshold', () => {
  const runner = processRunner(controller)

  runner({ ...configuration, currentValue: 10 })
  const result = runner({ ...configuration, currentValue: 21 })

  expect(result).toEqual(true)
})

test('keeps on when temperature is at threshold', () => {
  const runner = processRunner(controller)

  runner({ ...configuration, currentValue: 10 })
  const result = runner({ ...configuration, currentValue: 22 })

  expect(result).toEqual(true)
})

test('turns off when temperature is above threshold', () => {
  const runner = processRunner(controller)

  runner({ ...configuration, currentValue: 10 })
  const result = runner({ ...configuration, currentValue: 23 })

  expect(result).toEqual(false)
})
