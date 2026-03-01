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

// Dashboard Statistics
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

// Donation Stats
export interface DonationStatsData {
    total_amount: number;
    total_count: number;
    by_type: Record<string, { amount: number; count: number }>;
    by_status: Record<string, { amount: number; count: number }>;
    monthly_totals: Array<{ month: string; amount: number; count: number }>;
}

export interface DonationStatsResponse extends ApiResponse<DonationStatsData> {}
