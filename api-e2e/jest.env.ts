global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;
global.clearImmediate = jest.useRealTimers as unknown as typeof clearImmediate;
