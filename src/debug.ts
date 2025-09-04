// Debug file to check environment variables
console.log('Environment variables debug:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('All env:', import.meta.env);

// Export for use in components
export const debugEnv = () => {
  console.log('Current API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');
};
