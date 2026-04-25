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
    ANNOUNCEMENT = "announcement",
    GENERAL = "general",
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
