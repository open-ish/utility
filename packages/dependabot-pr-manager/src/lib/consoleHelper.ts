const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

export const consoleHelper = (message: string, color: keyof typeof colors) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};
