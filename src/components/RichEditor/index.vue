<template>
    <div class="rich-editor-container editor-container">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            mode="default"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
        />
        <Editor
            style="height: 500px; overflow-y: hidden"
            mode="simple"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            @onCreated="handleCreated"
        />
    </div>
</template>

<script setup>
import { onBeforeUnmount, ref, shallowRef, watch, defineEmits, defineProps } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { uploadImg } from '@/api/image';
import '@wangeditor/editor/dist/css/style.css';

const props = defineProps({
    id: {
        type: String
    },
    value: {
        type: String,
        default: ''
    },
    toolbar: {
        type: Array,
        required: false,
        default() {
            return [];
        }
    },
    height: {
        type: Number,
        required: false,
        default: 360
    },
    width: {
        type: Number,
        required: false,
        default: 720
    }
});
const emit = defineEmits(['update:value']);

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const valueHtml = ref(''); // 内容 HTML

const toolbarConfig = { excludeKeys: ['uploadVideo', 'insertVideo'] };
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: {
            customUpload: handleImageAdded // 自定义上传图片
        }
    }
};

watch(
    () => props.value,
    (val, preval) => {
        valueHtml.value = val;
    }
);

watch(
    () => valueHtml.value,
    (val, preval) => {
        emit('update:value', val);
    }
);

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;

    if (editor) {
        editor.destroy();
    }
});

const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
};

function handleImageAdded(file, insertFn) {
    const formData = new FormData();
    formData.append('image', file);

    uploadImg({
        data: formData
    })
        .then((result) => {
            const url = result.data.url;
            insertFn(url);
        })
        .catch((err) => {
            console.log(err);
        });
}
</script>

<style scoped>
.rich-editor-container {
    position: relative;
    border: 1px solid #ccc;
}
</style>
