import { getConnection } from "./db";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
  created_at: string;
}

export interface UserWithPermissions extends User {
  permissions: string[];
  role: string;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// User queries
export async function getUserByEmail(email: string): Promise<User | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, role_id, created_at FROM users WHERE email = ?",
      [email],
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  } finally {
    await connection.end();
  }
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, role_id, created_at FROM users WHERE username = ?",
      [username],
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  } finally {
    await connection.end();
  }
}

export async function getUserById(id: number): Promise<User | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, role_id, created_at FROM users WHERE id = ?",
      [id],
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  } finally {
    await connection.end();
  }
}

export async function getUserByIdWithPassword(
  id: number,
): Promise<(User & { password_hash: string }) | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, role_id, password_hash, created_at FROM users WHERE id = ?",
      [id],
    );
    const users = rows as (User & { password_hash: string })[];
    return users.length > 0 ? users[0] : null;
  } finally {
    await connection.end();
  }
}

export async function getUserWithPermissions(
  id: number,
): Promise<UserWithPermissions | null> {
  const connection = await getConnection();
  try {
    const [userRows] = await connection.execute(
      `
      SELECT u.id, u.username, u.email, u.role_id, u.created_at, r.name as role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `,
      [id],
    );

    const users = userRows as (User & { role: string })[];
    if (users.length === 0) return null;

    const user = users[0];

    const [permRows] = await connection.execute(
      `
      SELECT p.name
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `,
      [user.role_id],
    );

    const permissions = (permRows as { name: string }[]).map((p) => p.name);

    return {
      ...user,
      permissions,
      role: user.role,
    };
  } finally {
    await connection.end();
  }
}

export async function createUser(
  username: string,
  email: string,
  password: string,
): Promise<User> {
  const connection = await getConnection();
  try {
    const passwordHash = await hashPassword(password);
    const [result] = await connection.execute(
      "INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, 2)",
      [username, email, passwordHash],
    );

    const insertResult = result as any;
    const userId = insertResult.insertId;

    const user = await getUserById(userId);
    if (!user) throw new Error("Failed to create user");

    return user;
  } finally {
    await connection.end();
  }
}

export async function verifyUserPassword(
  email: string,
  password: string,
): Promise<User | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, role_id, password_hash, created_at FROM users WHERE email = ?",
      [email],
    );
    const users = rows as (User & { password_hash: string })[];

    if (users.length === 0) return null;

    const user = users[0];
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) return null;

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } finally {
    await connection.end();
  }
}

// Role and permission queries
export async function getAllUsers(): Promise<User[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, role_id, created_at FROM users",
    );
    return rows as User[];
  } finally {
    await connection.end();
  }
}

export async function getAllRoles() {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, name, description FROM roles",
    );
    return rows as { id: number; name: string; description: string }[];
  } finally {
    await connection.end();
  }
}

export async function updateUserRole(
  userId: number,
  roleId: number,
): Promise<void> {
  const connection = await getConnection();
  try {
    await connection.execute("UPDATE users SET role_id = ? WHERE id = ?", [
      roleId,
      userId,
    ]);
  } finally {
    await connection.end();
  }
}

export async function deleteUser(userId: number): Promise<void> {
  const connection = await getConnection();
  try {
    await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
  } finally {
    await connection.end();
  }
}

// Password reset
export async function createPasswordResetToken(
  userId: number,
): Promise<string> {
  const connection = await getConnection();
  try {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await connection.execute(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt],
    );

    return token;
  } finally {
    await connection.end();
  }
}

export async function verifyPasswordResetToken(
  token: string,
): Promise<number | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()",
      [token],
    );

    const tokens = rows as { user_id: number }[];
    return tokens.length > 0 ? tokens[0].user_id : null;
  } finally {
    await connection.end();
  }
}

export async function resetPassword(
  userId: number,
  newPassword: string,
): Promise<void> {
  const connection = await getConnection();
  try {
    const passwordHash = await hashPassword(newPassword);
    await connection.execute(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [passwordHash, userId],
    );
    await connection.execute(
      "DELETE FROM password_reset_tokens WHERE user_id = ?",
      [userId],
    );
  } finally {
    await connection.end();
  }
}

export async function hasPermission(
  userId: number,
  permissionName: string,
): Promise<boolean> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      `
      SELECT COUNT(*) as count FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN users u ON u.role_id = rp.role_id
      WHERE u.id = ? AND p.name = ?
    `,
      [userId, permissionName],
    );

    const result = rows as { count: number }[];
    return result[0].count > 0;
  } finally {
    await connection.end();
  }
}

// Role Management
export async function getRoleWithPermissions(roleId: number) {
  const connection = await getConnection();
  try {
    const [roleRows] = await connection.execute(
      "SELECT id, name, description FROM roles WHERE id = ?",
      [roleId],
    );

    const roles = roleRows as {
      id: number;
      name: string;
      description: string;
    }[];
    if (roles.length === 0) return null;

    const role = roles[0];

    const [permRows] = await connection.execute(
      `
      SELECT p.id, p.name, p.description
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `,
      [roleId],
    );

    return {
      ...role,
      permissions: permRows,
    };
  } finally {
    await connection.end();
  }
}

export async function createRole(
  name: string,
  description: string,
  permissionIds: number[],
): Promise<number> {
  const connection = await getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO roles (name, description) VALUES (?, ?)",
      [name, description],
    );

    const insertResult = result as any;
    const roleId = insertResult.insertId;

    if (permissionIds.length > 0) {
      for (const permId of permissionIds) {
        await connection.execute(
          "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
          [roleId, permId],
        );
      }
    }

    return roleId;
  } finally {
    await connection.end();
  }
}

export async function updateRole(
  roleId: number,
  name: string,
  description: string,
  permissionIds: number[],
): Promise<void> {
  const connection = await getConnection();
  try {
    // Update role info
    await connection.execute(
      "UPDATE roles SET name = ?, description = ? WHERE id = ?",
      [name, description, roleId],
    );

    // Clear existing permissions
    await connection.execute("DELETE FROM role_permissions WHERE role_id = ?", [
      roleId,
    ]);

    // Add new permissions
    if (permissionIds.length > 0) {
      for (const permId of permissionIds) {
        await connection.execute(
          "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
          [roleId, permId],
        );
      }
    }
  } finally {
    await connection.end();
  }
}

export async function deleteRole(roleId: number): Promise<void> {
  const connection = await getConnection();
  try {
    // Check if this is a default role
    const [rows] = await connection.execute(
      "SELECT id FROM roles WHERE id IN (1, 2) AND id = ?",
      [roleId],
    );

    if ((rows as any[]).length > 0) {
      throw new Error("Cannot delete default roles");
    }

    await connection.execute("DELETE FROM roles WHERE id = ?", [roleId]);
  } finally {
    await connection.end();
  }
}

// Permission Management
export interface Permission {
  id: number;
  name: string;
  description: string;
}

export async function getAllPermissions(): Promise<Permission[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, name, description FROM permissions ORDER BY name",
    );
    return rows as Permission[];
  } finally {
    await connection.end();
  }
}

// User Search
export async function searchUsers(query: string): Promise<User[]> {
  const connection = await getConnection();
  try {
    const searchTerm = `%${query}%`;
    const [rows] = await connection.execute(
      `
      SELECT id, username, email, role_id, created_at FROM users
      WHERE username LIKE ? OR email LIKE ? OR id = ?
      ORDER BY username
      LIMIT 50
    `,
      [searchTerm, searchTerm, isNaN(parseInt(query)) ? 0 : parseInt(query)],
    );
    return rows as User[];
  } finally {
    await connection.end();
  }
}

// Audit Logging
export interface AuditLog {
  id: number;
  admin_id: number;
  action: string;
  resource_type: string;
  resource_id: number | null;
  changes: string | null;
  ip_address: string | null;
  created_at: string;
}

export async function logAuditAction(
  adminId: number,
  action: string,
  resourceType: string,
  resourceId: number | null = null,
  changes: Record<string, any> | null = null,
  ipAddress: string | null = null,
): Promise<void> {
  const connection = await getConnection();
  try {
    await connection.execute(
      `
      INSERT INTO audit_logs (admin_id, action, resource_type, resource_id, changes, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        adminId,
        action,
        resourceType,
        resourceId,
        changes ? JSON.stringify(changes) : null,
        ipAddress,
      ],
    );
  } finally {
    await connection.end();
  }
}

export async function getAuditLogs(
  limit: number = 100,
  offset: number = 0,
): Promise<(AuditLog & { admin_username: string })[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      `
      SELECT al.*, u.username as admin_username
      FROM audit_logs al
      JOIN users u ON al.admin_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [limit, offset],
    );
    return rows as (AuditLog & { admin_username: string })[];
  } finally {
    await connection.end();
  }
}

// User Profile Management
export async function updateUserProfile(
  userId: number,
  username: string,
  email: string,
): Promise<void> {
  const connection = await getConnection();
  try {
    // Check if email is already in use by another user
    const [existingEmail] = await connection.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId],
    );

    if ((existingEmail as any[]).length > 0) {
      throw new Error("Email is already in use");
    }

    // Check if username is already in use by another user
    const [existingUsername] = await connection.execute(
      "SELECT id FROM users WHERE username = ? AND id != ?",
      [username, userId],
    );

    if ((existingUsername as any[]).length > 0) {
      throw new Error("Username is already in use");
    }

    await connection.execute(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, userId],
    );
  } finally {
    await connection.end();
  }
}

export async function changeUserPassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const connection = await getConnection();
  try {
    const user = await getUserByIdWithPassword(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    const passwordHash = await hashPassword(newPassword);
    await connection.execute(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [passwordHash, userId],
    );
  } finally {
    await connection.end();
  }
}
