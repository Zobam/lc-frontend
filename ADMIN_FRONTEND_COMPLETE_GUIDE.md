# LightCity Admin Frontend Implementation Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [TypeScript Enums](#typescript-enums)
5. [Data Models & Types](#data-models--types)
6. [API Response Types](#api-response-types)
7. [API Endpoints](#api-endpoints)
8. [Composables](#composables)
9. [Error Handling](#error-handling)
10. [Form Validation](#form-validation)
11. [Page Implementations](#page-implementations)

---

## Project Overview

This is an admin-facing dashboard for the LightCity Laravel API. The admin interface allows authorized users to manage:

- Users, Roles & Permissions
- Events & Event Images
- Posts & Post Images
- Albums & Album Images
- Video Links
- Comments
- Donations

**Important**: This guide covers ONLY admin-facing features. No public/user-facing aspects are included.

---

## Tech Stack

- **Framework**: Nuxt 4
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn-vue
- **API**: Laravel 12 REST API with Sanctum authentication
- **TypeScript**: Full type safety

---

## Project Structure

```
pages/
└── admin/
    ├── index.vue              # Admin dashboard
    ├── users/
    │   ├── index.vue          # Users list
    │   ├── [id].vue           # User details/edit
    │   └── create.vue         # Create user
    ├── events/
    │   ├── index.vue          # Events list
    │   ├── [id].vue           # Event details/edit
    │   └── create.vue         # Create event
    ├── posts/
    │   ├── index.vue          # Posts list
    │   ├── [id].vue           # Post details/edit
    │   └── create.vue         # Create post
    ├── albums/
    │   ├── index.vue          # Albums list
    │   ├── [id].vue           # Album details/edit
    │   └── create.vue         # Create album
    └── video-links/
        ├── index.vue          # Video links list
        ├── [id].vue           # Video link details/edit
        └── create.vue         # Create video link

composables/
├── useApi.ts                  # API client wrapper
├── useAuth.ts                 # Authentication logic
└── useToast.ts                # Toast notifications

types/
├── enums.ts                   # All TypeScript enums
├── models.ts                  # Data model interfaces
└── api.ts                     # API response types
```

---

## TypeScript Enums

Create `types/enums.ts`:

```typescript
// User Status
export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
}

// Post Category
export enum PostCategory {
    SERMON = "sermon",
    TESTIMONY = "testimony",
    ANNOUNCEMENT = "announcement",
    DEVOTIONAL = "devotional",
    NEWS = "news",
    TEACHING = "teaching",
}

// Album Category
export enum AlbumCategory {
    EVENT = "event",
    WORSHIP = "worship",
    OUTREACH = "outreach",
    FELLOWSHIP = "fellowship",
    YOUTH = "youth",
    CHILDREN = "children",
    GENERAL = "general",
}

// Album Status
export enum AlbumStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    HIDDEN = "hidden",
}

// Video Category
export enum VideoCategory {
    SERMON = "sermon",
    WORSHIP = "worship",
    TESTIMONY = "testimony",
    TEACHING = "teaching",
    ANNOUNCEMENT = "announcement",
    EVENT = "event",
}

// Video Status
export enum VideoStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

// Donation Type
export enum DonationType {
    TITHE = "tithe",
    OFFERING = "offering",
    SEED = "seed",
    MISSION_SUPPORT = "mission_support",
    BUILDING_FUND = "building_fund",
    GIFT = "gift",
}

// Donation Status
export enum DonationStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    CANCELLED = "cancelled",
    MANUAL = "manual",
}
```

---

## Data Models & Types

Create `types/models.ts`:

```typescript
import {
    UserStatus,
    PostCategory,
    AlbumCategory,
    AlbumStatus,
    VideoCategory,
    VideoStatus,
    DonationType,
    DonationStatus,
} from "./enums";

// Base timestamps interface
interface Timestamps {
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

// User Model
export interface User extends Timestamps {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
    status: UserStatus;
    email_verified_at?: string | null;
    phone_number_verified_at?: string | null;
    roles?: Role[];
    permissions?: Permission[];
}

// Role Model
export interface Role extends Timestamps {
    id: string;
    name: string;
    guard_name: string;
    permissions?: Permission[];
    users_count?: number;
}

// Permission Model
export interface Permission extends Timestamps {
    id: string;
    name: string;
    guard_name: string;
    roles?: Role[];
}

// Event Model
export interface Event extends Timestamps {
    id: string;
    user_id: string;
    title: string;
    description: string;
    location: string;
    event_dates: string[]; // JSON array of datetime strings
    start_date: string;
    end_date: string;
    is_recurring: boolean;
    recurrence_pattern?: string | null;
    slug: string;
    creator?: User;
    images?: EventImage[];
    images_count?: number;
}

// Event Image Model
export interface EventImage extends Timestamps {
    id: string;
    event_id: string;
    image_path: string;
    image_url: string;
    is_primary: boolean;
    caption?: string | null;
    order: number;
    event?: Event;
}

// Post Model
export interface Post extends Timestamps {
    id: string;
    user_id: string;
    title: string;
    subtitle?: string | null;
    body: string;
    excerpt?: string | null;
    slug: string;
    category: PostCategory;
    tags?: string[];
    is_published: boolean;
    is_auto_approved: boolean;
    views: number;
    published_by?: string | null;
    published_at?: string | null;
    meta_description?: string | null;
    featured_image_id?: string | null;
    author?: User;
    publisher?: User;
    images?: PostImage[];
    comments?: Comment[];
    reading_time?: string;
    comments_count?: number;
}

// Post Image Model
export interface PostImage extends Timestamps {
    id: string;
    post_id: string;
    image_path: string;
    image_url: string;
    is_featured: boolean;
    alt_text?: string | null;
    caption?: string | null;
    order: number;
    post?: Post;
}

// Album Model
export interface Album extends Timestamps {
    id: string;
    user_id: string;
    event_id?: string | null;
    title: string;
    description?: string | null;
    slug: string;
    category: AlbumCategory;
    status: AlbumStatus;
    images_count: number;
    directory_name: string;
    cover_image_id?: string | null;
    user?: User;
    event?: Event;
    images?: AlbumImage[];
    cover_image_url?: string | null;
    thumbnail_url?: string | null;
}

// Album Image Model
export interface AlbumImage extends Timestamps {
    id: string;
    album_id: string;
    image_path: string;
    image_url: string;
    thumbnail_small_path?: string | null;
    thumbnail_small_url?: string | null;
    thumbnail_medium_path?: string | null;
    thumbnail_medium_url?: string | null;
    thumbnail_large_path?: string | null;
    thumbnail_large_url?: string | null;
    caption?: string | null;
    order: number;
    status: "visible" | "hidden";
    album?: Album;
}

// Video Link Model
export interface VideoLink extends Timestamps {
    id: string;
    user_id: string;
    title: string;
    description?: string | null;
    url: string;
    video_id: string;
    thumbnail_url?: string | null;
    duration?: string | null;
    published_at?: string | null;
    status: VideoStatus;
    category: VideoCategory;
    view_count: number;
    is_featured: boolean;
    order: number;
    user?: User;
    embed_url?: string;
    youtube_url?: string;
    formatted_duration?: string | null;
    hq_thumbnail_url?: string;
    max_res_thumbnail_url?: string;
}

// Comment Model
export interface Comment extends Timestamps {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    is_approved: boolean;
    approved_by?: string | null;
    approved_at?: string | null;
    post?: Post;
    user?: User;
    approver?: User;
}

// Donation Model
export interface Donation extends Timestamps {
    id: string;
    user_id?: string | null;
    email: string;
    amount: number;
    currency: string;
    type: DonationType;
    status: DonationStatus;
    reference: string;
    paystack_reference?: string | null;
    transaction_id?: string | null;
    authorization_url?: string | null;
    access_code?: string | null;
    donor_name?: string | null;
    donor_phone?: string | null;
    notes?: string | null;
    admin_notes?: string | null;
    approved_by?: string | null;
    paid_at?: string | null;
    webhook_verified_at?: string | null;
    metadata?: Record<string, any> | null;
    user?: User;
    approver?: User;
    formatted_amount?: string;
    type_label?: string;
    status_label?: string;
    status_color?: string;
}
```

---

## API Response Types

Create `types/api.ts`:

```typescript
import type {
    User,
    Role,
    Permission,
    Event,
    EventImage,
    Post,
    PostImage,
    Album,
    AlbumImage,
    VideoLink,
    Comment,
    Donation,
} from "./models";

// Base API Response
export interface ApiResponse<T = any> {
    status: "success" | "error";
    message: string;
    data?: T;
}

// Paginated Response
export interface PaginatedResponse<T> {
    status: "success";
    message: string;
    data: T[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

// Authentication Responses
export interface LoginResponse {
    status: "success";
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface SignupResponse {
    status: "success";
    message: string;
    data: {
        user: User;
    };
}

// User Responses
export interface UserResponse extends ApiResponse<User> {}
export interface UsersListResponse extends PaginatedResponse<User> {}

// Role & Permission Responses
export interface RoleResponse extends ApiResponse<Role> {}
export interface RolesListResponse extends ApiResponse<Role[]> {}
export interface PermissionResponse extends ApiResponse<Permission> {}
export interface PermissionsListResponse extends ApiResponse<Permission[]> {}

// Event Responses
export interface EventResponse extends ApiResponse<Event> {}
export interface EventsListResponse extends PaginatedResponse<Event> {}
export interface EventImageResponse extends ApiResponse<EventImage> {}

// Post Responses
export interface PostResponse extends ApiResponse<Post> {}
export interface PostsListResponse extends PaginatedResponse<Post> {}
export interface PostImageResponse extends ApiResponse<PostImage> {}

// Album Responses
export interface AlbumResponse extends ApiResponse<Album> {}
export interface AlbumsListResponse extends PaginatedResponse<Album> {}
export interface AlbumImageResponse extends ApiResponse<AlbumImage> {}

// Video Link Responses
export interface VideoLinkResponse extends ApiResponse<VideoLink> {}
export interface VideoLinksListResponse extends PaginatedResponse<VideoLink> {}

// Comment Responses
export interface CommentResponse extends ApiResponse<Comment> {}
export interface CommentsListResponse extends PaginatedResponse<Comment> {}

// Donation Responses
export interface DonationResponse extends ApiResponse<Donation> {}
export interface DonationsListResponse extends PaginatedResponse<Donation> {}

// Statistics Response (for dashboard)
export interface DashboardStats {
    users_count: number;
    events_count: number;
    posts_count: number;
    albums_count: number;
    videos_count: number;
    comments_pending: number;
    donations_total: number;
    donations_this_month: number;
}

export interface DashboardStatsResponse extends ApiResponse<DashboardStats> {}
```

---

## API Endpoints

All endpoints are prefixed with `/api`. Authentication uses Laravel Sanctum bearer tokens.

### Authentication Endpoints

```typescript
// POST /api/signup
interface SignupRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
}

// POST /api/signin
interface SigninRequest {
    email: string;
    password: string;
}

// POST /api/signout
// No body required, uses bearer token

// POST /api/send-otp
interface SendOtpRequest {
    email: string;
    otp_action:
        | "email_verification"
        | "password_reset"
        | "phone_number_verification";
}

// POST /api/verify-otp
interface VerifyOtpRequest {
    email: string;
    otp: string;
    otp_action: string;
}

// POST /api/change-password
interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}
```

### User Management Endpoints

```typescript
// GET /api/users?page=1&per_page=15&search=term&status=active
// Response: UsersListResponse

// GET /api/users/{id}
// Response: UserResponse

// POST /api/users
interface CreateUserRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
    status?: UserStatus;
    role_ids?: string[];
}
// Response: UserResponse

// PUT /api/users/{id}
interface UpdateUserRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    status?: UserStatus;
    avatar?: File;
}
// Response: UserResponse

// DELETE /api/users/{id}
// Response: ApiResponse

// POST /api/users/{id}/assign-roles
interface AssignRolesRequest {
    role_ids: string[];
}
// Response: UserResponse

// POST /api/users/{id}/assign-permissions
interface AssignPermissionsRequest {
    permission_ids: string[];
}
// Response: UserResponse
```

### Role & Permission Endpoints

```typescript
// GET /api/roles
// Response: RolesListResponse

// GET /api/roles/{id}
// Response: RoleResponse

// POST /api/roles
interface CreateRoleRequest {
    name: string;
    permission_ids?: string[];
}
// Response: RoleResponse

// PUT /api/roles/{id}
interface UpdateRoleRequest {
    name?: string;
    permission_ids?: string[];
}
// Response: RoleResponse

// DELETE /api/roles/{id}
// Response: ApiResponse

// GET /api/permissions
// Response: PermissionsListResponse
```

### Event Endpoints

```typescript
// GET /api/events?page=1&per_page=15&search=term&upcoming=true
// Response: EventsListResponse

// GET /api/events/{id}
// Response: EventResponse

// POST /api/events
interface CreateEventRequest {
    title: string;
    description: string;
    location: string;
    event_dates: string[]; // Array of ISO datetime strings
    is_recurring?: boolean;
    recurrence_pattern?: string;
    images?: File[];
}
// Response: EventResponse

// PUT /api/events/{id}
interface UpdateEventRequest {
    title?: string;
    description?: string;
    location?: string;
    event_dates?: string[];
    is_recurring?: boolean;
    recurrence_pattern?: string;
}
// Response: EventResponse

// DELETE /api/events/{id}
// Response: ApiResponse

// POST /api/events/{id}/images
interface AddEventImagesRequest {
    images: File[];
    captions?: string[];
}
// Response: ApiResponse<EventImage[]>

// DELETE /api/events/{eventId}/images/{imageId}
// Response: ApiResponse

// PUT /api/events/{eventId}/images/{imageId}/set-primary
// Response: EventImageResponse
```

### Post Endpoints

```typescript
// GET /api/posts?page=1&per_page=15&search=term&category=sermon&status=published
// Response: PostsListResponse

// GET /api/posts/{id}
// Response: PostResponse

// POST /api/posts
interface CreatePostRequest {
    title: string;
    subtitle?: string;
    body: string;
    excerpt?: string;
    category: PostCategory;
    tags?: string[];
    is_published?: boolean;
    meta_description?: string;
    images?: File[];
}
// Response: PostResponse

// PUT /api/posts/{id}
interface UpdatePostRequest {
    title?: string;
    subtitle?: string;
    body?: string;
    excerpt?: string;
    category?: PostCategory;
    tags?: string[];
    is_published?: boolean;
    meta_description?: string;
}
// Response: PostResponse

// DELETE /api/posts/{id}
// Response: ApiResponse

// POST /api/posts/{id}/publish
// Response: PostResponse

// POST /api/posts/{id}/unpublish
// Response: PostResponse

// POST /api/posts/{id}/images
interface AddPostImagesRequest {
    images: File[];
    alt_texts?: string[];
    captions?: string[];
}
// Response: ApiResponse<PostImage[]>

// DELETE /api/posts/{postId}/images/{imageId}
// Response: ApiResponse

// PUT /api/posts/{postId}/images/{imageId}/set-featured
// Response: PostImageResponse
```

### Album Endpoints

```typescript
// GET /api/albums?page=1&per_page=15&search=term&category=event&status=published
// Response: AlbumsListResponse

// GET /api/albums/{id}
// Response: AlbumResponse

// POST /api/albums
interface CreateAlbumRequest {
    title: string;
    description?: string;
    category: AlbumCategory;
    status?: AlbumStatus;
    event_id?: string;
    images?: File[];
}
// Response: AlbumResponse

// PUT /api/albums/{id}
interface UpdateAlbumRequest {
    title?: string;
    description?: string;
    category?: AlbumCategory;
    status?: AlbumStatus;
    event_id?: string;
}
// Response: AlbumResponse

// DELETE /api/albums/{id}
// Response: ApiResponse

// POST /api/albums/{id}/images
interface AddAlbumImagesRequest {
    images: File[];
    captions?: string[];
}
// Response: ApiResponse<AlbumImage[]>

// DELETE /api/albums/{albumId}/images/{imageId}
// Response: ApiResponse

// PUT /api/albums/{albumId}/images/{imageId}
interface UpdateAlbumImageRequest {
    caption?: string;
    order?: number;
    status?: "visible" | "hidden";
}
// Response: AlbumImageResponse

// PUT /api/albums/{albumId}/images/{imageId}/set-cover
// Response: AlbumResponse
```

### Video Link Endpoints

```typescript
// GET /api/video-links?page=1&per_page=15&search=term&category=sermon&status=active
// Response: VideoLinksListResponse

// GET /api/video-links/{id}
// Response: VideoLinkResponse

// POST /api/video-links
interface CreateVideoLinkRequest {
    title: string;
    description?: string;
    url: string; // YouTube URL
    category: VideoCategory;
    status?: VideoStatus;
    is_featured?: boolean;
    published_at?: string;
}
// Response: VideoLinkResponse

// PUT /api/video-links/{id}
interface UpdateVideoLinkRequest {
    title?: string;
    description?: string;
    url?: string;
    category?: VideoCategory;
    status?: VideoStatus;
    is_featured?: boolean;
    order?: number;
    published_at?: string;
}
// Response: VideoLinkResponse

// DELETE /api/video-links/{id}
// Response: ApiResponse

// PUT /api/video-links/{id}/toggle-featured
// Response: VideoLinkResponse
```

### Comment Endpoints

```typescript
// GET /api/comments?page=1&per_page=15&post_id=xxx&is_approved=false
// Response: CommentsListResponse

// GET /api/comments/{id}
// Response: CommentResponse

// POST /api/comments/{id}/approve
// Response: CommentResponse

// POST /api/comments/{id}/reject
// Response: ApiResponse

// DELETE /api/comments/{id}
// Response: ApiResponse
```

### Donation Endpoints

```typescript
// GET /api/donations?page=1&per_page=15&status=successful&type=tithe&start_date=2024-01-01&end_date=2024-12-31
// Response: DonationsListResponse

// GET /api/donations/{id}
// Response: DonationResponse

// POST /api/donations/manual
interface CreateManualDonationRequest {
    email: string;
    amount: number;
    type: DonationType;
    donor_name?: string;
    donor_phone?: string;
    notes?: string;
    admin_notes?: string;
    paid_at?: string;
}
// Response: DonationResponse

// PUT /api/donations/{id}
interface UpdateDonationRequest {
    admin_notes?: string;
    status?: DonationStatus;
}
// Response: DonationResponse

// GET /api/donations/stats?start_date=2024-01-01&end_date=2024-12-31
interface DonationStatsResponse {
    total_amount: number;
    total_count: number;
    by_type: Record<DonationType, { amount: number; count: number }>;
    by_status: Record<DonationStatus, { amount: number; count: number }>;
    monthly_totals: Array<{ month: string; amount: number; count: number }>;
}
// Response: ApiResponse<DonationStatsResponse>
```

---

## Composables

### useApi Composable

Create `composables/useApi.ts`:

```typescript
import type { ApiResponse, PaginatedResponse } from "~/types/api";

export const useApi = () => {
    const config = useRuntimeConfig();
    const { token, clearAuth } = useAuth();
    const toast = useToast();

    const baseURL = config.public.apiBase || "http://localhost:8000/api";

    // Create fetch instance with auth headers
    const apiFetch = async <T = any>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<T> => {
        const headers: HeadersInit = {
            Accept: "application/json",
            ...options.headers,
        };

        // Add auth token if available
        if (token.value) {
            headers["Authorization"] = `Bearer ${token.value}`;
        }

        // Handle FormData (for file uploads)
        if (!(options.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        try {
            const response = await fetch(`${baseURL}${endpoint}`, {
                ...options,
                headers,
            });

            // Handle 401 Unauthorized
            if (response.status === 401) {
                clearAuth();
                navigateTo("/login");
                throw new Error("Unauthorized");
            }

            const data = await response.json();

            // Handle API errors
            if (!response.ok || data.status === "error") {
                throw new Error(data.message || "An error occurred");
            }

            return data as T;
        } catch (error: any) {
            toast.error(error.message || "Network error occurred");
            throw error;
        }
    };

    // GET request
    const get = <T = any>(endpoint: string, params?: Record<string, any>) => {
        const queryString = params
            ? "?" + new URLSearchParams(params).toString()
            : "";
        return apiFetch<T>(`${endpoint}${queryString}`, { method: "GET" });
    };

    // POST request
    const post = <T = any>(endpoint: string, body?: any) => {
        return apiFetch<T>(endpoint, {
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    };

    // PUT request
    const put = <T = any>(endpoint: string, body?: any) => {
        return apiFetch<T>(endpoint, {
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    };

    // DELETE request
    const del = <T = any>(endpoint: string) => {
        return apiFetch<T>(endpoint, { method: "DELETE" });
    };

    // PATCH request
    const patch = <T = any>(endpoint: string, body?: any) => {
        return apiFetch<T>(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    };

    return {
        get,
        post,
        put,
        delete: del,
        patch,
    };
};
```

### useAuth Composable

Create `composables/useAuth.ts`:

```typescript
import type { User } from "~/types/models";
import type { LoginResponse, SignupResponse, ApiResponse } from "~/types/api";

export const useAuth = () => {
    const token = useCookie<string | null>("auth_token", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    const user = useState<User | null>("auth_user", () => null);
    const api = useApi();
    const toast = useToast();

    // Check if user is authenticated
    const isAuthenticated = computed(() => !!token.value && !!user.value);

    // Login
    const login = async (email: string, password: string) => {
        try {
            const response = await api.post<LoginResponse>("/signin", {
                email,
                password,
            });

            token.value = response.data.token;
            user.value = response.data.user;

            toast.success("Login successful");
            return response.data.user;
        } catch (error: any) {
            toast.error(error.message || "Login failed");
            throw error;
        }
    };

    // Signup
    const signup = async (data: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        phone_number?: string;
    }) => {
        try {
            const response = await api.post<SignupResponse>("/signup", data);
            toast.success("Signup successful. Please verify your email.");
            return response.data.user;
        } catch (error: any) {
            toast.error(error.message || "Signup failed");
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await api.post("/signout");
        } catch (error) {
            // Ignore errors on logout
        } finally {
            clearAuth();
            navigateTo("/login");
            toast.success("Logged out successfully");
        }
    };

    // Clear auth state
    const clearAuth = () => {
        token.value = null;
        user.value = null;
    };

    // Fetch current user
    const fetchUser = async () => {
        if (!token.value) return null;

        try {
            const response = await api.get<ApiResponse<User>>("/user");
            user.value = response.data;
            return response.data;
        } catch (error) {
            clearAuth();
            return null;
        }
    };

    // Change password
    const changePassword = async (oldPassword: string, newPassword: string) => {
        try {
            await api.post("/change-password", {
                old_password: oldPassword,
                new_password: newPassword,
            });
            toast.success("Password changed successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to change password");
            throw error;
        }
    };

    // Send OTP
    const sendOtp = async (
        email: string,
        action:
            | "email_verification"
            | "password_reset"
            | "phone_number_verification",
    ) => {
        try {
            await api.post("/send-otp", {
                email,
                otp_action: action,
            });
            toast.success("OTP sent successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to send OTP");
            throw error;
        }
    };

    // Verify OTP
    const verifyOtp = async (email: string, otp: string, action: string) => {
        try {
            const response = await api.post<ApiResponse<{ user: User }>>(
                "/verify-otp",
                {
                    email,
                    otp,
                    otp_action: action,
                },
            );
            toast.success("OTP verified successfully");
            return response.data.user;
        } catch (error: any) {
            toast.error(error.message || "Failed to verify OTP");
            throw error;
        }
    };

    return {
        token,
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        clearAuth,
        fetchUser,
        changePassword,
        sendOtp,
        verifyOtp,
    };
};
```

### useToast Composable

Create `composables/useToast.ts`:

```typescript
export const useToast = () => {
    // This is a simple implementation
    // Replace with your preferred toast library (e.g., vue-toastification, shadcn toast)

    const success = (message: string) => {
        console.log("✅ Success:", message);
        // Implement your toast notification here
        // Example: toast.success(message)
    };

    const error = (message: string) => {
        console.error("❌ Error:", message);
        // Implement your toast notification here
        // Example: toast.error(message)
    };

    const info = (message: string) => {
        console.info("ℹ️ Info:", message);
        // Implement your toast notification here
        // Example: toast.info(message)
    };

    const warning = (message: string) => {
        console.warn("⚠️ Warning:", message);
        // Implement your toast notification here
        // Example: toast.warning(message)
    };

    return {
        success,
        error,
        info,
        warning,
    };
};
```

---

## Error Handling

### Global Error Handler

Create `plugins/error-handler.ts`:

```typescript
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("vue:error", (error, instance, info) => {
        console.error("Vue error:", error, info);
        // Log to error tracking service (e.g., Sentry)
    });

    nuxtApp.hook("app:error", (error) => {
        console.error("App error:", error);
        // Log to error tracking service
    });
});
```

### API Error Handling Pattern

```typescript
// In your components/pages
const { data, error, pending } = await useAsyncData("users", () =>
    api.get<UsersListResponse>("/users", { page: 1, per_page: 15 }),
);

if (error.value) {
    toast.error(error.value.message || "Failed to load users");
}
```

### Form Submission Error Handling

```typescript
const handleSubmit = async () => {
    loading.value = true;
    errors.value = {};

    try {
        const response = await api.post<UserResponse>("/users", formData.value);
        toast.success("User created successfully");
        navigateTo("/admin/users");
    } catch (error: any) {
        // Handle validation errors
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors;
        } else {
            toast.error(error.message || "Failed to create user");
        }
    } finally {
        loading.value = false;
    }
};
```

---

## Form Validation

### Client-Side Validation with Zod

Install Zod: `npm install zod`

Create `utils/validation.ts`:

```typescript
import { z } from "zod";

// User validation schemas
export const createUserSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone_number: z.string().optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export const updateUserSchema = createUserSchema.partial();

// Event validation schemas
export const createEventSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
    location: z.string().min(3, "Location is required"),
    event_dates: z.array(z.string()).min(1, "At least one date is required"),
    is_recurring: z.boolean().optional(),
    recurrence_pattern: z.string().optional(),
});

export const updateEventSchema = createEventSchema.partial();

// Post validation schemas
export const createPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    subtitle: z.string().optional(),
    body: z.string().min(50, "Body must be at least 50 characters"),
    excerpt: z.string().optional(),
    category: z.enum([
        "sermon",
        "testimony",
        "announcement",
        "devotional",
        "news",
        "teaching",
    ]),
    tags: z.array(z.string()).optional(),
    is_published: z.boolean().optional(),
    meta_description: z.string().optional(),
});

export const updatePostSchema = createPostSchema.partial();

// Album validation schemas
export const createAlbumSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    category: z.enum([
        "event",
        "worship",
        "outreach",
        "fellowship",
        "youth",
        "children",
        "general",
    ]),
    status: z.enum(["draft", "published", "hidden"]).optional(),
    event_id: z.string().uuid().optional(),
});

export const updateAlbumSchema = createAlbumSchema.partial();

// Video Link validation schemas
export const createVideoLinkSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    url: z
        .string()
        .url("Invalid YouTube URL")
        .includes("youtube.com", { message: "Must be a YouTube URL" }),
    category: z.enum([
        "sermon",
        "worship",
        "testimony",
        "teaching",
        "announcement",
        "event",
    ]),
    status: z.enum(["active", "inactive"]).optional(),
    is_featured: z.boolean().optional(),
});

export const updateVideoLinkSchema = createVideoLinkSchema.partial();
```

### Using Validation in Forms

```typescript
<script setup lang="ts">
import { createUserSchema } from '~/utils/validation'

const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone_number: '',
  status: 'active',
})

const errors = ref<Record<string, string>>({})

const validateForm = () => {
  try {
    createUserSchema.parse(formData.value)
    errors.value = {}
    return true
  } catch (error: any) {
    if (error.errors) {
      errors.value = error.errors.reduce((acc: any, err: any) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})
    }
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  // Submit form
  try {
    await api.post('/users', formData.value)
    toast.success('User created successfully')
  } catch (error: any) {
    toast.error(error.message)
  }
}
</script>
```

---

## Page Implementations

### Admin Dashboard (pages/admin/index.vue)

```vue
<script setup lang="ts">
import type { DashboardStatsResponse } from "~/types/api";

definePageMeta({
    middleware: "auth",
    layout: "admin",
});

const api = useApi();
const toast = useToast();

const {
    data: stats,
    pending,
    error,
    refresh,
} = await useAsyncData("dashboard-stats", () =>
    api.get<DashboardStatsResponse>("/admin/stats"),
);

if (error.value) {
    toast.error("Failed to load dashboard statistics");
}
</script>

<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div
            v-if="pending"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            <div
                v-for="i in 8"
                :key="i"
                class="bg-white rounded-lg shadow p-6 animate-pulse"
            >
                <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
        </div>

        <div
            v-else-if="stats"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            <!-- Users Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Total Users</p>
                        <p class="text-3xl font-bold">
                            {{ stats.data.users_count }}
                        </p>
                    </div>
                    <div class="bg-blue-100 p-3 rounded-full">
                        <svg
                            class="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    </div>
                </div>
                <NuxtLink
                    to="/admin/users"
                    class="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                    View all users →
                </NuxtLink>
            </div>

            <!-- Events Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Total Events</p>
                        <p class="text-3xl font-bold">
                            {{ stats.data.events_count }}
                        </p>
                    </div>
                    <div class="bg-green-100 p-3 rounded-full">
                        <svg
                            class="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                </div>
                <NuxtLink
                    to="/admin/events"
                    class="text-sm text-green-600 hover:underline mt-2 inline-block"
                >
                    View all events →
                </NuxtLink>
            </div>

            <!-- Posts Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Total Posts</p>
                        <p class="text-3xl font-bold">
                            {{ stats.data.posts_count }}
                        </p>
                    </div>
                    <div class="bg-purple-100 p-3 rounded-full">
                        <svg
                            class="w-6 h-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                </div>
                <NuxtLink
                    to="/admin/posts"
                    class="text-sm text-purple-600 hover:underline mt-2 inline-block"
                >
                    View all posts →
                </NuxtLink>
            </div>

            <!-- Pending Comments Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Pending Comments</p>
                        <p class="text-3xl font-bold">
                            {{ stats.data.comments_pending }}
                        </p>
                    </div>
                    <div class="bg-yellow-100 p-3 rounded-full">
                        <svg
                            class="w-6 h-6 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                            />
                        </svg>
                    </div>
                </div>
                <NuxtLink
                    to="/admin/comments?status=pending"
                    class="text-sm text-yellow-600 hover:underline mt-2 inline-block"
                >
                    Review comments →
                </NuxtLink>
            </div>

            <!-- Albums Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Total Albums</p>
                        <p class="text-3xl font-bold">
                            {{ stats.data.albums_count }}
                        </p>
                    </div>
                    <div class="bg-pink-100 p-3 rounded-full">
                        <svg
                            class="w-6 h-6 text-pink-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                </div>
                <NuxtLink
                    to="/admin/albums"
                    class="text-sm text-pink-600 hover:underline mt-2 inline-block"
                >
                    View all albums →
                </NuxtLink>
            </div>

            <!-- Videos Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Total Videos</p>
                        <p class="text-3xl font-bold">
                            {{ stats.data.videos_count }}
                        </p>
                    </div>
                    <div class="bg-red-100 p-3 rounded-full">
                        <svg
                            class="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                </div>
                <NuxtLink
                    to="/admin/video-links"
                    class="text-sm text-red-600 hover:underline mt-2 inline-block"
                >
                    View all videos →
                </NuxtLink>
            </div>

            <!-- Donations This Month Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">
                            Donations (This Month)
                        </p>
                        <p class="text-3xl font-bold">
                            ₦{{
                                stats.data.donations_this_month.toLocaleString()
                            }}
                        </p>
                    </div>
                    <div class="bg-emerald-100 p-3 rounded-full">
                        <svg
                            class="w-6 h-6 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>
                <NuxtLink
                    to="/admin/donations"
                    class="text-sm text-emerald-600 hover:underline mt-2 inline-block"
                >
                    View all donations →
                </NuxtLink>
            </div>

            <!-- Total Donations Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Total Donations</p>
                        <p class="text-3xl font-bold">
                            ₦{{ stats.data.donations_total.toLocaleString() }}
                        </p>
                    </div>
                    <div class="bg-teal-100 p-3 rounded-full">
                        <svg
                            class="w-6 h-6 text-teal-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
```

### Users List Page (pages/admin/users/index.vue)

```vue
<script setup lang="ts">
import type { UsersListResponse } from "~/types/api";
import type { User } from "~/types/models";
import { UserStatus } from "~/types/enums";

definePageMeta({
    middleware: "auth",
    layout: "admin",
});

const api = useApi();
const toast = useToast();
const route = useRoute();
const router = useRouter();

// Filters
const page = ref(Number(route.query.page) || 1);
const perPage = ref(15);
const search = ref((route.query.search as string) || "");
const statusFilter = ref((route.query.status as UserStatus) || "");

// Fetch users
const {
    data: usersData,
    pending,
    error,
    refresh,
} = await useAsyncData(
    "users",
    () =>
        api.get<UsersListResponse>("/users", {
            page: page.value,
            per_page: perPage.value,
            search: search.value,
            status: statusFilter.value,
        }),
    { watch: [page, search, statusFilter] },
);

// Handle search
const handleSearch = useDebounceFn(() => {
    page.value = 1;
    router.push({
        query: {
            ...route.query,
            search: search.value || undefined,
            page: 1,
        },
    });
}, 500);

// Handle status filter
const handleStatusFilter = (status: UserStatus | "") => {
    statusFilter.value = status;
    page.value = 1;
    router.push({
        query: {
            ...route.query,
            status: status || undefined,
            page: 1,
        },
    });
};

// Handle pagination
const goToPage = (newPage: number) => {
    page.value = newPage;
    router.push({
        query: {
            ...route.query,
            page: newPage,
        },
    });
};

// Delete user
const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        await api.delete(`/users/${userId}`);
        toast.success("User deleted successfully");
        refresh();
    } catch (error: any) {
        toast.error(error.message || "Failed to delete user");
    }
};
</script>

<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Users</h1>
            <NuxtLink
                to="/admin/users/create"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Create User
            </NuxtLink>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Search -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Search</label
                    >
                    <input
                        v-model="search"
                        @input="handleSearch"
                        type="text"
                        placeholder="Search by name or email..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Status</label
                    >
                    <select
                        v-model="statusFilter"
                        @change="handleStatusFilter(statusFilter)"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option :value="UserStatus.ACTIVE">Active</option>
                        <option :value="UserStatus.INACTIVE">Inactive</option>
                        <option :value="UserStatus.SUSPENDED">Suspended</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="bg-white rounded-lg shadow">
            <div class="animate-pulse p-6">
                <div
                    v-for="i in 5"
                    :key="i"
                    class="flex items-center space-x-4 mb-4"
                >
                    <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div class="flex-1">
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Users Table -->
        <div
            v-else-if="usersData?.data"
            class="bg-white rounded-lg shadow overflow-hidden"
        >
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            User
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Email
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Status
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Roles
                        </th>
                        <th
                            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                        v-for="user in usersData.data"
                        :key="user.id"
                        class="hover:bg-gray-50"
                    >
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <img
                                    :src="
                                        user.avatar_url || '/default-avatar.png'
                                    "
                                    :alt="user.first_name"
                                    class="w-10 h-10 rounded-full"
                                />
                                <div class="ml-4">
                                    <div
                                        class="text-sm font-medium text-gray-900"
                                    >
                                        {{ user.first_name }}
                                        {{ user.last_name }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            {{ user.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span
                                :class="{
                                    'bg-green-100 text-green-800':
                                        user.status === UserStatus.ACTIVE,
                                    'bg-gray-100 text-gray-800':
                                        user.status === UserStatus.INACTIVE,
                                    'bg-red-100 text-red-800':
                                        user.status === UserStatus.SUSPENDED,
                                }"
                                class="px-2 py-1 text-xs font-semibold rounded-full"
                            >
                                {{ user.status }}
                            </span>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            <span v-if="user.roles && user.roles.length > 0">
                                {{ user.roles.map((r) => r.name).join(", ") }}
                            </span>
                            <span v-else class="text-gray-400">No roles</span>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        >
                            <NuxtLink
                                :to="`/admin/users/${user.id}`"
                                class="text-blue-600 hover:text-blue-900 mr-4"
                            >
                                Edit
                            </NuxtLink>
                            <button
                                @click="deleteUser(user.id)"
                                class="text-red-600 hover:text-red-900"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div
                v-if="usersData.meta"
                class="bg-gray-50 px-6 py-4 flex items-center justify-between"
            >
                <div class="text-sm text-gray-700">
                    Showing {{ usersData.meta.from }} to
                    {{ usersData.meta.to }} of
                    {{ usersData.meta.total }} results
                </div>
                <div class="flex space-x-2">
                    <button
                        @click="goToPage(page - 1)"
                        :disabled="page === 1"
                        class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Previous
                    </button>
                    <button
                        v-for="pageNum in usersData.meta.last_page"
                        :key="pageNum"
                        @click="goToPage(pageNum)"
                        :class="{
                            'bg-blue-600 text-white': pageNum === page,
                            'bg-white text-gray-700 hover:bg-gray-100':
                                pageNum !== page,
                        }"
                        class="px-3 py-1 border border-gray-300 rounded-lg"
                    >
                        {{ pageNum }}
                    </button>
                    <button
                        @click="goToPage(page + 1)"
                        :disabled="page === usersData.meta.last_page"
                        class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-lg shadow p-12 text-center">
            <p class="text-gray-500">No users found</p>
        </div>
    </div>
</template>
```

---

### Create User Page (pages/admin/users/create.vue)

```vue
<script setup lang="ts">
import type { UserResponse } from "~/types/api";
import type { Role } from "~/types/models";
import { UserStatus } from "~/types/enums";
import { createUserSchema } from "~/utils/validation";

definePageMeta({
    middleware: "auth",
    layout: "admin",
});

const api = useApi();
const toast = useToast();
const router = useRouter();

// Form data
const formData = ref({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    status: UserStatus.ACTIVE,
    role_ids: [] as string[],
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);

// Fetch roles
const { data: rolesData } = await useAsyncData("roles", () =>
    api.get("/roles"),
);

// Validate form
const validateForm = () => {
    try {
        createUserSchema.parse(formData.value);
        errors.value = {};
        return true;
    } catch (error: any) {
        if (error.errors) {
            errors.value = error.errors.reduce((acc: any, err: any) => {
                acc[err.path[0]] = err.message;
                return acc;
            }, {});
        }
        return false;
    }
};

// Submit form
const handleSubmit = async () => {
    if (!validateForm()) {
        toast.error("Please fix validation errors");
        return;
    }

    loading.value = true;

    try {
        await api.post<UserResponse>("/users", formData.value);
        toast.success("User created successfully");
        router.push("/admin/users");
    } catch (error: any) {
        toast.error(error.message || "Failed to create user");
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="p-6">
        <div class="mb-6">
            <NuxtLink to="/admin/users" class="text-blue-600 hover:underline">
                ← Back to Users
            </NuxtLink>
        </div>

        <h1 class="text-3xl font-bold mb-6">Create User</h1>

        <form
            @submit.prevent="handleSubmit"
            class="bg-white rounded-lg shadow p-6 max-w-2xl"
        >
            <!-- First Name -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="formData.first_name"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errors.first_name }"
                />
                <p v-if="errors.first_name" class="text-red-500 text-sm mt-1">
                    {{ errors.first_name }}
                </p>
            </div>

            <!-- Last Name -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="formData.last_name"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errors.last_name }"
                />
                <p v-if="errors.last_name" class="text-red-500 text-sm mt-1">
                    {{ errors.last_name }}
                </p>
            </div>

            <!-- Email -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="formData.email"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errors.email }"
                />
                <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                    {{ errors.email }}
                </p>
            </div>

            <!-- Password -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Password <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="formData.password"
                    type="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errors.password }"
                />
                <p v-if="errors.password" class="text-red-500 text-sm mt-1">
                    {{ errors.password }}
                </p>
            </div>

            <!-- Phone Number -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                </label>
                <input
                    v-model="formData.phone_number"
                    type="tel"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <!-- Status -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Status
                </label>
                <select
                    v-model="formData.status"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option :value="UserStatus.ACTIVE">Active</option>
                    <option :value="UserStatus.INACTIVE">Inactive</option>
                    <option :value="UserStatus.SUSPENDED">Suspended</option>
                </select>
            </div>

            <!-- Roles -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Roles
                </label>
                <div v-if="rolesData?.data" class="space-y-2">
                    <label
                        v-for="role in rolesData.data"
                        :key="role.id"
                        class="flex items-center"
                    >
                        <input
                            v-model="formData.role_ids"
                            type="checkbox"
                            :value="role.id"
                            class="mr-2"
                        />
                        <span>{{ role.name }}</span>
                    </label>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
                <NuxtLink
                    to="/admin/users"
                    class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </NuxtLink>
                <button
                    type="submit"
                    :disabled="loading"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {{ loading ? "Creating..." : "Create User" }}
                </button>
            </div>
        </form>
    </div>
</template>
```

### Events List Page (pages/admin/events/index.vue)

```vue
<script setup lang="ts">
import type { EventsListResponse } from "~/types/api";
import type { Event } from "~/types/models";

definePageMeta({
    middleware: "auth",
    layout: "admin",
});

const api = useApi();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const perPage = ref(15);
const search = ref((route.query.search as string) || "");
const upcomingOnly = ref(route.query.upcoming === "true");

const {
    data: eventsData,
    pending,
    refresh,
} = await useAsyncData(
    "events",
    () =>
        api.get<EventsListResponse>("/events", {
            page: page.value,
            per_page: perPage.value,
            search: search.value,
            upcoming: upcomingOnly.value,
        }),
    { watch: [page, search, upcomingOnly] },
);

const handleSearch = useDebounceFn(() => {
    page.value = 1;
    router.push({
        query: {
            ...route.query,
            search: search.value || undefined,
            page: 1,
        },
    });
}, 500);

const deleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
        await api.delete(`/events/${eventId}`);
        toast.success("Event deleted successfully");
        refresh();
    } catch (error: any) {
        toast.error(error.message || "Failed to delete event");
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
</script>

<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Events</h1>
            <NuxtLink
                to="/admin/events/create"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Create Event
            </NuxtLink>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Search</label
                    >
                    <input
                        v-model="search"
                        @input="handleSearch"
                        type="text"
                        placeholder="Search events..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div class="flex items-end">
                    <label class="flex items-center">
                        <input
                            v-model="upcomingOnly"
                            type="checkbox"
                            class="mr-2"
                        />
                        <span class="text-sm font-medium text-gray-700"
                            >Show upcoming only</span
                        >
                    </label>
                </div>
            </div>
        </div>

        <!-- Events Grid -->
        <div
            v-if="pending"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <div
                v-for="i in 6"
                :key="i"
                class="bg-white rounded-lg shadow animate-pulse"
            >
                <div class="h-48 bg-gray-200"></div>
                <div class="p-4">
                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </div>

        <div
            v-else-if="eventsData?.data"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <div
                v-for="event in eventsData.data"
                :key="event.id"
                class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
                <div class="h-48 bg-gray-200 relative">
                    <img
                        v-if="event.images && event.images[0]"
                        :src="event.images[0].image_url"
                        :alt="event.title"
                        class="w-full h-full object-cover"
                    />
                    <div
                        v-else
                        class="flex items-center justify-center h-full text-gray-400"
                    >
                        No Image
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold mb-2">
                        {{ event.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mb-2">
                        {{ event.location }}
                    </p>
                    <p class="text-sm text-gray-500 mb-4">
                        {{ formatDate(event.start_date) }}
                        <span v-if="event.start_date !== event.end_date">
                            - {{ formatDate(event.end_date) }}
                        </span>
                    </p>
                    <div class="flex justify-end space-x-2">
                        <NuxtLink
                            :to="`/admin/events/${event.id}`"
                            class="text-blue-600 hover:text-blue-900 text-sm"
                        >
                            Edit
                        </NuxtLink>
                        <button
                            @click="deleteEvent(event.id)"
                            class="text-red-600 hover:text-red-900 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow p-12 text-center">
            <p class="text-gray-500">No events found</p>
        </div>
    </div>
</template>
```

---

## Additional Implementation Notes

### Authentication Middleware

Create `middleware/auth.ts`:

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated.value) {
        return navigateTo("/login");
    }
});
```

### Admin Layout

Create `layouts/admin.vue`:

```vue
<script setup lang="ts">
const { user, logout } = useAuth();
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Sidebar -->
        <aside class="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
            <div class="p-6">
                <h2 class="text-2xl font-bold">LightCity Admin</h2>
            </div>
            <nav class="mt-6">
                <NuxtLink
                    to="/admin"
                    class="block px-6 py-3 hover:bg-gray-800"
                    active-class="bg-gray-800"
                >
                    Dashboard
                </NuxtLink>
                <NuxtLink
                    to="/admin/users"
                    class="block px-6 py-3 hover:bg-gray-800"
                    active-class="bg-gray-800"
                >
                    Users
                </NuxtLink>
                <NuxtLink
                    to="/admin/events"
                    class="block px-6 py-3 hover:bg-gray-800"
                    active-class="bg-gray-800"
                >
                    Events
                </NuxtLink>
                <NuxtLink
                    to="/admin/posts"
                    class="block px-6 py-3 hover:bg-gray-800"
                    active-class="bg-gray-800"
                >
                    Posts
                </NuxtLink>
                <NuxtLink
                    to="/admin/albums"
                    class="block px-6 py-3 hover:bg-gray-800"
                    active-class="bg-gray-800"
                >
                    Albums
                </NuxtLink>
                <NuxtLink
                    to="/admin/video-links"
                    class="block px-6 py-3 hover:bg-gray-800"
                    active-class="bg-gray-800"
                >
                    Videos
                </NuxtLink>
                <NuxtLink
                    to="/admin/comments"
                    class="block px-6 py-3 hover:bg-gray-800"
                    active-class="bg-gray-800"
                >
                    Comments
                </NuxtLink>
                <NuxtLink
                    to="/admin/donations"
                    class="block px-6 py-3 hover:bg-gray-800"
                    active-class="bg-gray-800"
                >
                    Donations
                </NuxtLink>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="ml-64">
            <!-- Header -->
            <header class="bg-white shadow">
                <div class="flex justify-between items-center px-6 py-4">
                    <div></div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-700">
                            {{ user?.first_name }} {{ user?.last_name }}
                        </span>
                        <button
                            @click="logout"
                            class="text-sm text-red-600 hover:text-red-900"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main>
                <slot />
            </main>
        </div>
    </div>
</template>
```

### Environment Configuration

Create `.env`:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

### Nuxt Config

Update `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
    modules: ["@nuxtjs/tailwindcss"],

    runtimeConfig: {
        public: {
            apiBase:
                process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000/api",
        },
    },

    app: {
        head: {
            title: "LightCity Admin",
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
            ],
        },
    },
});
```

---

## Summary

This guide provides:

1. Complete TypeScript type definitions for all models and API responses
2. Reusable composables for API calls, authentication, and notifications
3. Comprehensive API endpoint documentation with request/response types
4. Form validation patterns using Zod
5. Example page implementations for Users and Events
6. Error handling patterns
7. Authentication middleware
8. Admin layout structure

The same patterns can be applied to implement the remaining admin pages (Posts, Albums, Video Links, Comments, Donations) following the examples provided for Users and Events.

All code follows best practices for Nuxt 4, TypeScript, and Tailwind CSS, with proper error handling and user feedback throughout.
