<script setup lang="ts">
import { useScreen } from '../../composables/useScreen';
import draggable from 'vuedraggable';
import DraggableComponent from './DraggableComponent.vue';

const { screen, selectNode, selectedNodeId, isPreview, handleSmartDrop } = useScreen();

const onSelect = (id: string) => {
    selectNode(id);
};

const onChange = (evt: any) => {
    if (evt.added) {
        handleSmartDrop(screen.value, evt.added.newIndex);
        selectNode(evt.added.element.id);
    }
};
</script>

<template>
  <div 
    class="transition-all duration-300" 
    :class="[
        isPreview ? 'w-full' : 'h-full bg-transparent overflow-auto p-8'
    ]"
    @click.self="selectNode(null)"
  >
    <div 
        class="mx-auto max-w-5xl relative transition-all duration-500 ease-in-out glass-panel p-8 min-h-[800px]"
        :class="[
            isPreview ? 'scale-100 opacity-100' : 'shadow-lg'
        ]"
    >
        <draggable
            v-model="screen"
            group="components"
            item-key="id"
            class="flex flex-wrap content-start items-start"
            :class="isPreview ? 'min-h-[200px]' : 'min-h-[800px] h-full'"
            ghost-class="ghost"
            :disabled="isPreview"
            :animation="200"
            @change="onChange"
        >
            <template #item="{ element }">
                <DraggableComponent :node="element" @select="onSelect" :selected-id="selectedNodeId" />
            </template>
        </draggable>
    </div>
  </div>
</template>
