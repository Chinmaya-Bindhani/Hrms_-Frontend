const users = [
  {
    id: 1,
    email: 'hr@example.com',
    password: 'password123', 
    name: 'Sarah (HR Manager)',
    role: 'HR',
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'password123',
    name: 'John (Employee)',
    role: 'USER',
  }
];

/**
 * Simulates a backend login API call.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Resolves with user data and token, or rejects with an error.
 */
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Exclude password from the returned user object
        const { password, ...userWithoutPassword } = user;
        
        resolve({
          success: true,
          token: 'mock-jwt-token-' + Math.random().toString(36).substring(7),
          user: userWithoutPassword
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800); // 800ms delay to feel like a real API call
  });
};
