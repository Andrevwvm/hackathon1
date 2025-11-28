<script setup lang="ts">
import { computed } from 'vue';
import type { ScreenNode } from '../../types';
import draggable from 'vuedraggable';
import { useScreen } from '../../composables/useScreen';

const props = defineProps<{
  node: ScreenNode;
  selectedId: string | null;
}>();

const emit = defineEmits(['select']);
const { isPreview, updateNodeProps, deleteNode, duplicateNode, handleSmartDrop } = useScreen();

const isContainer = computed(() => {
    return ['section', 'row', 'column', 'card', 'tabs', 'accordion'].includes(props.node.type);
});

const isSelected = computed(() => props.node.id === props.selectedId);

const onChange = (evt: any) => {
    if (evt.added && props.node.children) {
        handleSmartDrop(props.node.children, evt.added.newIndex);
        emit('select', evt.added.element.id);
    }
};

const onClick = (e: Event) => {
    if (isPreview.value) return;
    e.stopPropagation();
    emit('select', props.node.id);
};

const onDelete = (e: Event) => {
    e.stopPropagation();
    deleteNode(props.node.id);
};

const onDuplicate = (e: Event) => {
    e.stopPropagation();
    duplicateNode(props.node.id);
};

const startResize = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const element = (e.target as HTMLElement).closest('.group') as HTMLElement;
    const startWidth = element.offsetWidth;

    const onMouseMove = (e: MouseEvent) => {
        const newWidth = startWidth + (e.clientX - startX);
        updateNodeProps(props.node.id, { width: `${newWidth}px` });
    };

    const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
};

const wrapperStyle = computed(() => ({
    width: props.node.props.width,
    margin: props.node.props.margin,
    textAlign: props.node.props.align as any,
    flexShrink: 0,
}));

const innerStyle = computed(() => ({
    height: props.node.props.height,
    padding: props.node.props.padding,
    color: props.node.props.color,
    backgroundColor: props.node.props.backgroundColor,
    borderRadius: props.node.props.borderRadius,
    borderWidth: props.node.props.borderWidth,
    borderStyle: props.node.props.borderWidth ? 'solid' : undefined,
}));
</script>

<template>
  <div 
    class="relative group transition-all duration-300 ease-out animate-fade-in-up rounded-lg"
    :class="[
        !isPreview && isSelected ? 'ring-2 ring-blue-400/70 shadow-lg z-10 bg-blue-50/30 backdrop-blur-sm' : '',
        !isPreview && !isSelected ? 'hover:ring-1 hover:ring-blue-300/50 hover:bg-white/20' : '',
        node.props.class
    ]"
    :style="wrapperStyle"
    @click="onClick"
  >
    <!-- Resize Handle -->
    <div 
        v-if="isSelected && !isPreview" 
        class="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize bg-blue-400/50 hover:bg-blue-500 rounded-r-lg transition-colors z-20"
        @mousedown="startResize"
    ></div>

    <!-- Floating Toolbar -->
    <div 
        v-if="isSelected && !isPreview" 
        class="absolute -top-10 right-0 flex items-center gap-1 p-1 glass-panel z-30 animate-fade-in-up origin-bottom-right"
    >
        <button 
            @click="onDuplicate" 
            class="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
            title="Duplicate"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        </button>
        <div class="w-px h-4 bg-gray-300 mx-0.5"></div>
        <button 
            @click="onDelete" 
            class="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors"
            title="Delete"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>

    <!-- Render component based on type -->
    <div v-if="!isContainer" class="p-2">
        <template v-if="node.type === 'button'">
            <button 
                class="glass-button px-4 py-2 font-medium transition-all"
                :class="{
                    'bg-blue-600 text-white hover:bg-blue-700': !node.props.variant || node.props.variant === 'primary',
                    'bg-gray-200 text-gray-800 hover:bg-gray-300': node.props.variant === 'secondary',
                    'border-2 border-blue-600 text-blue-600 hover:bg-blue-50': node.props.variant === 'outline',
                    'text-blue-600 hover:bg-blue-50': node.props.variant === 'ghost',
                    'bg-red-600 text-white hover:bg-red-700': node.props.variant === 'danger',
                }"
                :style="innerStyle"
            >{{ node.props.label }}</button>
        </template>
        <template v-else-if="node.type === 'heading'">
            <component :is="node.props.level || 'h1'" class="font-bold text-2xl text-gray-800 dark:text-white" :style="innerStyle">{{ node.props.text }}</component>
        </template>
        <template v-else-if="node.type === 'text'">
            <p class="text-gray-600 dark:text-gray-300" :style="innerStyle">{{ node.props.text }}</p>
        </template>
        <template v-else-if="node.type === 'textInput'">
            <input :type="node.props.inputType || 'text'" :placeholder="node.props.placeholder" class="glass-input w-full p-2" :style="innerStyle" />
        </template>
        <template v-else-if="node.type === 'textarea'">
            <textarea :placeholder="node.props.placeholder" class="glass-input w-full p-2" :style="innerStyle"></textarea>
        </template>
        <template v-else-if="node.type === 'checkbox'">
            <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300" :style="innerStyle">
                <input type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                <span>{{ node.props.label }}</span>
            </label>
        </template>
        <template v-else-if="node.type === 'switch'">
            <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300" :style="innerStyle">
                <div class="w-10 h-6 bg-gray-200/80 dark:bg-gray-600/80 backdrop-blur-sm rounded-full relative transition-colors hover:bg-gray-300/80 border border-gray-300/50">
                    <div class="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                </div>
                <span>{{ node.props.label }}</span>
            </label>
        </template>
        <div v-else class="p-2 border border-gray-200/50 bg-white/30 backdrop-blur-sm rounded text-sm text-gray-500" :style="innerStyle">
            {{ node.type }} ({{ node.props.label || node.props.text }})
        </div>
    </div>

    <!-- Container rendering -->
    <div v-else class="min-h-[50px] p-2 transition-all" :style="innerStyle">
        <div v-if="!isPreview" class="text-xs text-gray-400 mb-1 uppercase select-none font-bold tracking-wider">{{ node.type }}</div>
        <draggable
            v-model="node.children"
            group="components"
            item-key="id"
            class="min-h-[50px] rounded-lg transition-all flex flex-wrap content-start items-start gap-0"
            :class="!isPreview ? 'border border-dashed border-gray-300/60 bg-white/10' : ''"
            ghost-class="ghost"
            :disabled="isPreview"
            :animation="200"
            @change="onChange"
        >
            <template #item="{ element }">
                <DraggableComponent :node="element" :selected-id="selectedId" @select="$emit('select', $event)" />
            </template>
        </draggable>
    </div>
  </div>
</template>