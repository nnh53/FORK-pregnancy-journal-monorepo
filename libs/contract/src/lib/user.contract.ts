import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { userRoleSchema, userStatusEnumSchema } from './enum.contract';
import { tagResSchema } from './tag.contract';

const c = initContract();

// Schemas
const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    password: z.string().regex(
      // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      /[\s\S]*/,
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    ),
    confirm_password: z.string(),
    last_ovulation_date: z.string().datetime(),
    expected_birth_date: z.string().datetime(),
    phone: z.string().min(1, 'Phone is required'),
    province: z.string().min(1, 'Province is required'),
    district: z.string().min(1, 'District is required'),
    ward: z.string().min(1, 'Ward is required'),
    address: z.string().min(1, 'Address is required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

const tokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

const refreshTokenReqSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

// Response schemas
const authResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
  }),
});

const messageResponseSchema = z.object({
  message: z.string(),
});

// Types
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type TokenRequest = z.infer<typeof tokenSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenReqSchema>;

//User
//User response
//User zod schema
const userResSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  lastOvulationDate: z.string().datetime(),
  expectedBirthDate: z.string().datetime(),
  membershipId: z.string().optional(),
  phone: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  address: z.string(),
  role: userRoleSchema,
  createAt: z.date(),
  status: userStatusEnumSchema,
  tags: z.array(tagResSchema),
});

//User get all zod schema
const userGetAllResSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createAt: z.date(),
    role: userRoleSchema,
    status: userStatusEnumSchema,
    tags: z.array(tagResSchema),
  }),
);

//User request schema
//User create request schema
const userCreateReqSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  expected_birth_date: z.string().datetime(),
  last_ovulation_date: z.string().datetime(),
  membershipId: z.string().optional(),
  phone: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  address: z.string(),
  role: userRoleSchema,
  status: userStatusEnumSchema,
});

//User update request schema
const userUpdateReqSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
  name: z.string().optional(),
  lastOvulationDate: z.string().datetime().optional(),
  expectedBirthDate: z.string().datetime().optional(),
  membershipId: z.string().optional(),
  phone: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  address: z.string().optional(),
  role: userRoleSchema.optional(),
  status: userStatusEnumSchema.optional(),
});

export type UserCreateRequest = z.infer<typeof userCreateReqSchema>;
export type UserUpdateRequest = z.infer<typeof userUpdateReqSchema>;

// Contract
export const authContract = c.router({
  register: {
    method: 'POST',
    path: '/users/auth/register',
    body: registerSchema,
    responses: {
      200: authResponseSchema,
      400: messageResponseSchema,
      401: messageResponseSchema,
    },
  },
  login: {
    method: 'POST',
    path: '/users/auth/login',
    body: loginSchema,
    responses: {
      200: authResponseSchema,
      401: messageResponseSchema,
    },
  },
  logout: {
    method: 'POST',
    path: '/users/auth/logout',
    body: tokenSchema,
    responses: {
      200: messageResponseSchema,
      401: messageResponseSchema,
    },
  },
  refreshToken: {
    method: 'POST',
    path: '/users/auth/refresh',
    body: tokenSchema,
    responses: {
      200: authResponseSchema,
      401: messageResponseSchema,
    },
  },
});

export const userContract = c.router({
  getAll: {
    method: 'GET',
    path: '/users',
    responses: {
      200: userGetAllResSchema,
      // 404: object({ message: string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: userResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/users',
    body: userCreateReqSchema,
    responses: {
      200: userResSchema,
      // 404: object({ message: string() }),
    },
  },
  update: {
    method: 'PATCH',
    path: '/users',
    body: userUpdateReqSchema,
    responses: {
      200: userResSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
