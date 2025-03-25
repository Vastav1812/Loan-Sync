import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
}

const USER_STORAGE_KEY = 'users';

export class UserDatabase {
  // Get all users
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  }

  // Save all users
  static async saveUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }

  // Create a new user
  static async createUser(name: string, email: string, password: string): Promise<User | null> {
    try {
      // Check if user already exists
      const users = await this.getAllUsers();
      const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        return null; // User already exists
      }

      // Create new user with unique ID
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };

      // Add user to storage
      users.push(newUser);
      await this.saveUsers(users);
      
      return newUser;
    } catch (error) {
      console.error('Failed to create user:', error);
      return null;
    }
  }

  // Find user by email
  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      return user || null;
    } catch (error) {
      console.error('Failed to find user:', error);
      return null;
    }
  }

  // Verify login credentials
  static async verifyCredentials(email: string, password: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(
        user => 
          user.email.toLowerCase() === email.toLowerCase() && 
          user.password === password
      );
      
      return user || null;
    } catch (error) {
      console.error('Failed to verify credentials:', error);
      return null;
    }
  }

  // Delete user by ID
  static async deleteUserById(userId: string): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      const filteredUsers = users.filter(user => user.id !== userId);
      
      if (filteredUsers.length === users.length) {
        return false; // No user was removed
      }
      
      await this.saveUsers(filteredUsers);
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  }
} 