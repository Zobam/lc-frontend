// Simple validation helpers — no external library needed

export interface ValidationErrors {
    [field: string]: string;
}

const required = (val: any, fieldName: string): string | null => {
    if (val === null || val === undefined || String(val).trim() === "") {
        return `${fieldName} is required`;
    }
    return null;
};

const minLength = (val: string, min: number, fieldName: string): string | null => {
    if (val && val.length < min) {
        return `${fieldName} must be at least ${min} characters`;
    }
    return null;
};

const email = (val: string): string | null => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !re.test(val)) {
        return "Please enter a valid email address";
    }
    return null;
};

const url = (val: string): string | null => {
    try {
        if (val) new URL(val);
        return null;
    } catch {
        return "Please enter a valid URL";
    }
};

const youtubeUrl = (val: string): string | null => {
    if (val && !val.includes("youtube.com") && !val.includes("youtu.be")) {
        return "Must be a valid YouTube URL";
    }
    return null;
};

const arrayMin = (val: any[], min: number, fieldName: string): string | null => {
    if (!val || val.length < min) {
        return `${fieldName} requires at least ${min} item(s)`;
    }
    return null;
};

// Collect errors from validators (skip null results)
const collect = (...errors: (string | null)[]): string | null => {
    return errors.find((e) => e !== null) ?? null;
};

// Validation schemas for each form type

export const validateCreateUser = (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
    status?: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};
    const fn = collect(required(data.first_name, "First name"), minLength(data.first_name, 2, "First name"));
    if (fn) errors.first_name = fn;
    const ln = collect(required(data.last_name, "Last name"), minLength(data.last_name, 2, "Last name"));
    if (ln) errors.last_name = ln;
    const em = collect(required(data.email, "Email"), email(data.email));
    if (em) errors.email = em;
    const pw = collect(required(data.password, "Password"), minLength(data.password, 8, "Password"));
    if (pw) errors.password = pw;
    return errors;
};

export const validateUpdateUser = (data: {
    first_name?: string;
    last_name?: string;
    email?: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (data.first_name !== undefined) {
        const fn = minLength(data.first_name, 2, "First name");
        if (fn) errors.first_name = fn;
    }
    if (data.last_name !== undefined) {
        const ln = minLength(data.last_name, 2, "Last name");
        if (ln) errors.last_name = ln;
    }
    if (data.email !== undefined) {
        const em = email(data.email);
        if (em) errors.email = em;
    }
    return errors;
};

export const validateEvent = (data: {
    title: string;
    description: string;
    location: string;
    event_dates: string[];
}): ValidationErrors => {
    const errors: ValidationErrors = {};
    const t = collect(required(data.title, "Title"), minLength(data.title, 3, "Title"));
    if (t) errors.title = t;
    const d = collect(required(data.description, "Description"), minLength(data.description, 10, "Description"));
    if (d) errors.description = d;
    const l = collect(required(data.location, "Location"));
    if (l) errors.location = l;
    const dates = arrayMin(data.event_dates, 1, "Event dates");
    if (dates) errors.event_dates = dates;
    return errors;
};

export const validatePost = (data: {
    title: string;
    body: string;
    category: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};
    const t = collect(required(data.title, "Title"), minLength(data.title, 3, "Title"));
    if (t) errors.title = t;
    const b = collect(required(data.body, "Body"), minLength(data.body, 50, "Body"));
    if (b) errors.body = b;
    const c = required(data.category, "Category");
    if (c) errors.category = c;
    return errors;
};

export const validateAlbum = (data: {
    title: string;
    category: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};
    const t = collect(required(data.title, "Title"), minLength(data.title, 3, "Title"));
    if (t) errors.title = t;
    const c = required(data.category, "Category");
    if (c) errors.category = c;
    return errors;
};

export const validateVideoLink = (data: {
    title: string;
    url: string;
    category: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};
    const t = collect(required(data.title, "Title"), minLength(data.title, 3, "Title"));
    if (t) errors.title = t;
    const u = collect(required(data.url, "URL"), url(data.url), youtubeUrl(data.url));
    if (u) errors.url = u;
    const c = required(data.category, "Category");
    if (c) errors.category = c;
    return errors;
};

export const validateManualDonation = (data: {
    email: string;
    amount: number;
    type: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};
    const em = collect(required(data.email, "Email"), email(data.email));
    if (em) errors.email = em;
    if (!data.amount || data.amount <= 0) errors.amount = "Amount must be greater than 0";
    const t = required(data.type, "Donation type");
    if (t) errors.type = t;
    return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
    return Object.keys(errors).length > 0;
};
