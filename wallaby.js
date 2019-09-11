module.exports = function () {
  process.env.NODE_ENV = 'test'

  return {
    files: [
      'src/**/*.js',
      'config/**/*.json',
      'app.js',
      'test/setup.js',
      'test/teardown.js'
    ],

    tests: ['test/**/*.test.js'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  }
}
