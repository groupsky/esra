export const runWithOutput = (computation, onOutput) => {
  let lastOutput
  return (...args) => {
    const output = computation(...args)

    if (typeof output === 'undefined') {
      throw new Error('Output is undefined')
    }

    if (typeof lastOutput === 'undefined' || output !== lastOutput) {
      lastOutput = output
      onOutput(output)
    }
    return output
  }
}
