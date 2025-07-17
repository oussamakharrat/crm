// controllers/authController.js
import { UserDetails, UserAuth, Role, RoleUser, Permissions, RolePermissions } from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mysql from 'mysql2';


dotenv.config();

// UserDetails CRUD
export const createUserDetails = async (req, res) => {
  try {
    // Remove id from req.body if present
    const { id, ...data } = req.body;
    const user = await UserDetails.create(data);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await UserDetails.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUserDetails = async (req, res) => {
  try {
    const users = await UserDetails.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const user = await UserDetails.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserDetails = async (req, res) => {
  try {
    await UserDetails.delete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UserAuth CRUD
export const createUserAuth = async (req, res) => {
  try {
    const { user_id, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields: email and password are required." });
    }
    // Assign default 'User' role if none exists
    let actualUserId = user_id;
    if (!actualUserId) {
      // If user_id is not provided, try to get the last inserted user or handle accordingly
      const lastUser = await UserDetails.findLastInserted();
      actualUserId = lastUser?.id;
    }
    if (!actualUserId) {
      return res.status(400).json({ error: "user_id is required or could not be determined automatically." });
    }
    let roles = await RoleUser.findByUserId(actualUserId);
    if (!roles || roles.length === 0) {
      const allRoles = await Role.findAll();
      const userRole = allRoles.find(r => r.name.toLowerCase() === 'user');
      if (userRole) {
        await RoleUser.create({ user_id: actualUserId, role_id: userRole.id });
      }
      // Fetch roles again after assignment
      roles = await RoleUser.findByUserId(actualUserId);
    }
    // Include roles in the JWT token
    const token = jwt.sign(
      {
        user_id: actualUserId,
        email,
        roles: roles.map(r => r.name)
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Remove id from req.body if present
    const { id, ...data } = req.body;
    const userAuth = await UserAuth.create({ ...data, user_id: actualUserId, token });
    res.status(201).json({ ...userAuth, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserAuth = async (req, res) => {
  try {
    const userAuth = await UserAuth.findById(req.params.id);
    if (!userAuth) return res.status(404).json({ error: 'UserAuth not found' });
    res.json(userAuth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUserAuth = async (req, res) => {
  try {
    const users = await UserAuth.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserAuthToken = async (req, res) => {
  try {
    const userAuth = await UserAuth.updateToken(req.params.id, req.body.token);
    res.json(userAuth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Role management
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignRoleToUser = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    // Remove all existing roles for this user
    await RoleUser.deleteByUserId(user_id);
    // Assign the new role
    const assignment = await RoleUser.create({ user_id, role_id });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserRoles = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const roles = await RoleUser.findByUserId(user_id);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Permissions management
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permissions.findAll();
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const permission = await Permissions.create(data);
    res.status(201).json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignPermissionToRole = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    const assignment = await RolePermissions.create({ role_id, permission_id });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRolePermissions = async (req, res) => {
  try {
    const role_id = req.params.role_id;
    const permissions = await RolePermissions.findByRoleId(role_id);
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user details (for authenticated user)
export const getCurrentUserDetails = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const userDetails = await UserDetails.findById(user_id);
    if (!userDetails) {
      return res.status(404).json({ error: 'User details not found' });
    }
    res.json(userDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload avatar for current user
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user_id = req.user.user_id;
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    // Update user's avatar in database
    const updatedUser = await UserDetails.update(user_id, { avatar: avatarPath });
    
    res.json({
      success: true,
      avatar: avatarPath,
      message: 'Avatar uploaded successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update current user profile (including avatar)
export const updateCurrentUserProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { name, phone, address, avatar } = req.body;
    
    const updatedUser = await UserDetails.update(user_id, { name, phone, address, avatar });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login endpoint
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserAuth.verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Get user details
    const userDetails = await UserDetails.findById(user.user_id);
    // Get user roles
    const userRoles = await RoleUser.findByUserId(user.user_id);
    // Get permissions for each role
    let allPermissions = [];
    for (const role of userRoles) {
      const rolePermissions = await RolePermissions.findByRoleId(role.role_id);
      for (const perm of rolePermissions) {
        const permission = await Permissions.findById(perm.permission_id);
        if (permission) {
          allPermissions.push(permission.name);
        }
      }
    }
    // Remove duplicate permissions
    const uniquePermissions = [...new Set(allPermissions)];
    // If user has Client role, set contact_id (simulate: use userDetails.id as contact_id if role is Client)
    let contact_id = undefined;
    if (userRoles.some(r => r.name.toLowerCase() === 'client')) {
      contact_id = userDetails?.id;
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        roles: userRoles.map(r => r.name),
        permissions: uniquePermissions,
        contact_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Update token in DB
    await UserAuth.updateToken(user.id, token);
    // Return complete user data
    res.json({
      id: user.id,
      user_id: user.user_id,
      email: user.email,
      token,
      name: userDetails?.name || '',
      phone: userDetails?.phone || '',
      address: userDetails?.address || '',
      avatar: userDetails?.avatar || '',
      roles: userRoles.map(r => r.name),
      permissions: uniquePermissions,
      contact_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
