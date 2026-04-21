<template>
    <div class="tiptap-wrapper" :class="{ errored: hasError }">
        <!-- Toolbar -->
        <div class="tiptap-toolbar" v-if="editor">
            <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().toggleBold().run()"
                    :class="{ active: editor.isActive('bold') }" title="Bold (Ctrl+B)">
                    <Icon name="mdi:format-bold" />
                </button>
                <button type="button" @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ active: editor.isActive('italic') }" title="Italic (Ctrl+I)">
                    <Icon name="mdi:format-italic" />
                </button>
                <button type="button" @click="editor.chain().focus().toggleStrike().run()"
                    :class="{ active: editor.isActive('strike') }" title="Strikethrough">
                    <Icon name="mdi:format-strikethrough" />
                </button>
            </div>
            <div class="toolbar-divider" />
            <div class="toolbar-group">
                <button type="button"
                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ active: editor.isActive('heading', { level: 2 }) }" title="Heading 2">
                    H2
                </button>
                <button type="button"
                    @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{ active: editor.isActive('heading', { level: 3 }) }" title="Heading 3">
                    H3
                </button>
            </div>
            <div class="toolbar-divider" />
            <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ active: editor.isActive('bulletList') }" title="Bullet List">
                    <Icon name="mdi:format-list-bulleted" />
                </button>
                <button type="button" @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ active: editor.isActive('orderedList') }" title="Ordered List">
                    <Icon name="mdi:format-list-numbered" />
                </button>
            </div>
            <div class="toolbar-divider" />
            <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ active: editor.isActive('blockquote') }" title="Blockquote">
                    <Icon name="mdi:format-quote-open" />
                </button>
                <button type="button" @click="editor.chain().focus().setHorizontalRule().run()"
                    title="Horizontal Rule">
                    <Icon name="mdi:minus" />
                </button>
            </div>
            <div class="toolbar-divider" />
            <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().undo().run()"
                    :disabled="!editor.can().undo()" title="Undo (Ctrl+Z)">
                    <Icon name="mdi:undo" />
                </button>
                <button type="button" @click="editor.chain().focus().redo().run()"
                    :disabled="!editor.can().redo()" title="Redo (Ctrl+Y)">
                    <Icon name="mdi:redo" />
                </button>
            </div>
        </div>

        <!-- Editor content area -->
        <EditorContent :editor="editor" class="tiptap-content" />
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

const props = defineProps<{
    modelValue: string;
    hasError?: boolean;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const editor = useEditor({
    content: props.modelValue,
    extensions: [StarterKit],
    // Required for Nuxt SSR — editor uses browser APIs not available on the server
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: 'tiptap-prose',
        },
    },
});

// Keep editor in sync if parent changes the value externally (e.g. reset)
watch(
    () => props.modelValue,
    (value) => {
        const isSame = editor.value?.getHTML() === value;
        if (isSame) return;
        editor.value?.commands.setContent(value, false);
    }
);

onBeforeUnmount(() => editor.value?.destroy());
</script>

<style scoped>
.tiptap-wrapper {
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    background: #fafafa;
    transition: border-color 0.15s;
    overflow: hidden;
}

.tiptap-wrapper:focus-within {
    border-color: #E05615;
    background: #fff;
}

.tiptap-wrapper.errored {
    border-color: #dc2626;
}

/* ── Toolbar ── */
.tiptap-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
    padding: 0.4rem 0.6rem;
    border-bottom: 1px solid #e4e4e7;
    background: #fff;
}

.toolbar-group {
    display: flex;
    align-items: center;
    gap: 1px;
}

.toolbar-divider {
    width: 1px;
    height: 18px;
    background: #e4e4e7;
    margin: 0 4px;
}

.tiptap-toolbar button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    background: transparent;
    border-radius: 5px;
    cursor: pointer;
    color: #52525b;
    font-size: 0.78rem;
    font-weight: 700;
    font-family: inherit;
    transition: background 0.12s, color 0.12s;
}

.tiptap-toolbar button:hover:not(:disabled) {
    background: rgba(224, 86, 21, 0.08);
    color: #E05615;
}

.tiptap-toolbar button.active {
    background: rgba(224, 86, 21, 0.12);
    color: #E05615;
}

.tiptap-toolbar button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}
</style>

<!-- Unscoped styles for ProseMirror content - must be global since Tiptap injects them into the DOM -->
<style>
.tiptap-prose {
    min-height: 280px;
    padding: 1rem 1rem;
    outline: none;
    font-size: 0.875rem;
    line-height: 1.7;
    color: #18181b;
}

.tiptap-prose > * + * {
    margin-top: 0.6em;
}

.tiptap-prose p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #a1a1aa;
    pointer-events: none;
    height: 0;
}

.tiptap-prose h2 {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1A0E08;
    margin: 1.2em 0 0.3em;
}

.tiptap-prose h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1A0E08;
    margin: 1em 0 0.25em;
}

.tiptap-prose ul,
.tiptap-prose ol {
    padding-left: 1.4rem;
}

.tiptap-prose li + li {
    margin-top: 0.2em;
}

.tiptap-prose blockquote {
    border-left: 3px solid #E05615;
    padding-left: 1rem;
    color: #71717a;
    font-style: italic;
    margin: 0.8em 0;
}

.tiptap-prose hr {
    border: none;
    border-top: 1px solid #e4e4e7;
    margin: 1.2em 0;
}

.tiptap-prose strong { font-weight: 700; }
.tiptap-prose em { font-style: italic; }
.tiptap-prose s { text-decoration: line-through; }

.tiptap-prose code {
    background: #f4f4f5;
    border-radius: 4px;
    padding: 0.1em 0.35em;
    font-size: 0.85em;
    font-family: monospace;
}
</style>
