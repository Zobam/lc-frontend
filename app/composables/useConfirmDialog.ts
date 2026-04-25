import { ref } from 'vue';

const isOpen = ref(false);
const title = ref("Are you sure?");
const description = ref("This action cannot be undone.");
let resolvePromise: ((val: boolean) => void) | null = null;

export const useConfirmDialog = () => {
    const showConfirm = (desc: string, customTitle?: string) => {
        description.value = desc;
        title.value = customTitle || "Are you sure?";
        isOpen.value = true;
        
        return new Promise<boolean>((resolve) => {
            resolvePromise = resolve;
        });
    };

    const accept = () => {
        if (resolvePromise) resolvePromise(true);
        isOpen.value = false;
    };

    const cancel = () => {
        if (resolvePromise) resolvePromise(false);
        isOpen.value = false;
    };

    return {
        isOpen,
        title,
        description,
        showConfirm,
        accept,
        cancel
    };
};
