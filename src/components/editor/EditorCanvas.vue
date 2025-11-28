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
  <div class="h-full bg-gray-100 dark:bg-gray-900 overflow-auto p-8 transition-all duration-300" @click.self="selectNode(null)">
    <div 
        class="min-h-[800px] bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mx-auto max-w-5xl relative transition-all duration-500 ease-in-out"
        :class="isPreview ? 'scale-100 opacity-100' : ''"
    >
        <draggable
            v-model="screen"
            group="components"
            item-key="id"
            class="min-h-[200px] h-full flex flex-wrap content-start items-start"
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
