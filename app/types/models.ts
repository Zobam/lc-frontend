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
    last_login_at?: string | null;
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
    user_id: number | string;
    title: string;
    subtitle?: string | null;
    description: string;
    location: string;
    event_dates: string[]; // JSON array of date strings
    start_date?: string | null;
    end_date?: string | null;
    status: string;
    creator?: User;
    images?: EventImage[];
    primary_image?: EventImage | null;
    images_count?: number;
}

// Event Image Model
export interface EventImage extends Timestamps {
    id: string;
    event_id: string;
    image_path: string;
    image_url: string;
    is_primary: boolean;
    alt_text?: string | null;
    event?: Event;
}

// Post Model
export interface Post extends Timestamps {
    id: string;
    user_id: number | string;
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
    published_by?: string | number | null;
    published_at?: string | null;
    meta_description?: string | null;
    featured_image_id?: string | null;
    author?: User;
    publisher?: User;
    images?: PostImage[];
    featured_image?: PostImage | null;
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
    visible_images?: AlbumImage[];
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
