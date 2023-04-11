import { expect, test, vi } from 'vitest'
import controller from './index.js'

const configuration = {
  p: 1,
  i: 0.1,
  d: 0.001,
  sp: 20,
}

test.each([0, 10, 20, 30, 40, 50])('first time returns output null', (pv) => {
  vi.useFakeTimers({
    now: 0,
  })
  const result = controller({ ...configuration, pv })
  expect(result).toEqual(expect.objectContaining({ output: null }))
})

test.each([
  { pv: 0, output: 22 },
  { pv: 10, output: 11 },
  { pv: 20, output: 0 },
  { pv: 30, output: -11 },
  { pv: 40, output: -22 },
  { pv: 50, output: -33 },
])('second time returns output $output (pv: $pv)', ({pv, output}) => {
  vi.useFakeTimers({
    now: 0,
  })
  const lastOutput = controller({ ...configuration, pv })

  vi.advanceTimersByTime(1000)
  const result = controller({ ...configuration, pv, lastOutput })
  expect(result).toEqual(expect.objectContaining({ output }))
})

test.each([
  { pv: 0, output: 24 },
  { pv: 10, output: 12 },
  { pv: 20, output: 0 },
  { pv: 30, output: -12 },
  { pv: 40, output: -24 },
  { pv: 50, output: -36 },
])('third time returns output $output (pv: $pv)', ({ pv, output }) => {
  vi.useFakeTimers({
    now: 0,
  })
  let lastOutput = controller({ ...configuration, pv })

  vi.advanceTimersByTime(1000)
  lastOutput = controller({ ...configuration, pv, lastOutput })

  vi.advanceTimersByTime(1000)
  const result = controller({ ...configuration, pv, lastOutput })
  expect(result).toEqual(expect.objectContaining({ output }))
})
