module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],

  // --- ADIÇÃO IMPORTANTE ---
  // Coleta a cobertura de todos os arquivos .ts dentro da pasta src
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    // Exclui arquivos que não precisam ser testados
    '!src/main.ts',
    '!src/**/index.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!src/infrastructure/database/sqlite.ts' // Exclui o arquivo de configuração do DB
  ],
  // Define a meta de cobertura. O Jest avisará se ela não for atingida.
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary"],
};
