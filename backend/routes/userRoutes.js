import express from 'express';
import {
  createUserDetails, getUserDetails, getAllUserDetails, updateUserDetails, deleteUserDetails,
  createUserAuth, getUserAuth, getAllUserAuth, updateUserAuthToken,
  getAllRoles, assignRoleToUser, getUserRoles,
  getAllPermissions, createPermission, assignPermissionToRole, getRolePermissions,
  loginUser, getCurrentUserDetails, updateCurrentUserProfile, uploadAvatar
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';



const router = express.Router();

// Public endpoints
router.post('/auth', createUserAuth);
router.post('/login', loginUser);
router.post('/details', createUserDetails);

// Protect all routes below this line
router.use(authenticate);

// Current user profile management
router.get('/profile', getCurrentUserDetails);
router.put('/profile', updateCurrentUserProfile);
router.post('/profile/avatar', upload.single('avatar'), uploadAvatar);

// userDetails CRUD
router.get('/details', getAllUserDetails);
router.get('/details/:id', getUserDetails);
router.put('/details/:id', updateUserDetails);
router.delete('/details/:id', deleteUserDetails);

// userAuth CRUD
router.get('/auth', getAllUserAuth);
router.get('/auth/:id', getUserAuth);
router.put('/auth/:id/token', updateUserAuthToken);

// Role management
router.get('/roles', getAllRoles);
router.post('/roles/assign', assignRoleToUser);
router.get('/roles/user/:user_id', getUserRoles);

// Permissions management
router.get('/permissions', getAllPermissions);
router.post('/permissions', createPermission);
router.post('/permissions/assign', assignPermissionToRole);
router.get('/permissions/role/:role_id', getRolePermissions);

export default router;