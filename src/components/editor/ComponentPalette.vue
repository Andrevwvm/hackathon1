<script setup lang="ts">
import { ref, computed } from 'vue';
import { COMPONENT_GROUPS } from '../../constants/components';
import draggable from 'vuedraggable';
import { v4 as uuidv4 } from 'uuid';
import { useScreen } from '../../composables/useScreen';

const { addNode, selectedNodeId } = useScreen();

const collapsedGroups = ref<Record<string, boolean>>({});
const searchQuery = ref('');

const toggleGroup = (title: string) => {
    if (searchQuery.value) return; // Disable toggling during search
    collapsedGroups.value[title] = !collapsedGroups.value[title];
};

const filteredGroups = computed(() => {
    if (!searchQuery.value) return COMPONENT_GROUPS;
    
    const query = searchQuery.value.toLowerCase();
    return COMPONENT_GROUPS.map(group => {
        const filteredItems = group.items.filter(item => 
            item.label.toLowerCase().includes(query) || 
            item.type.toLowerCase().includes(query)
        );
        
        if (filteredItems.length === 0) return null;
        
        return {
            ...group,
            items: filteredItems
        };
    }).filter(group => group !== null);
});

const isGroupCollapsed = (title: string) => {
    if (searchQuery.value) return false; // Always expand when searching
    return collapsedGroups.value[title];
};

const cloneComponent = (component: any) => {
  return {
    id: uuidv4(),
    type: component.type,
    props: { ...component.defaultProps, width: '100%' }, // Default width 100%
    children: [],
  };
};

const onComponentClick = (component: any) => {
    const newNode = cloneComponent(component);
    addNode(newNode, selectedNodeId.value || undefined);
};

const getIconForType = (type: string) => {
    const icons: Record<string, string> = {
        section: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />',
        row: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />',
        column: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 4v16m6-16v16" />',
        card: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />',
        button: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />',
        heading: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />',
        text: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />',
        textInput: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />',
        checkbox: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
        switch: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />',
        // Default icon
        default: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />'
    };
    return icons[type] || icons.default;
};
</script>

<template>
  <div class="h-full overflow-y-auto flex flex-col scrollbar-hide">
    <div class="p-4 border-b border-white/20 font-bold text-lg text-gray-800 dark:text-white bg-white/40 dark:bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div class="mb-2">Components</div>
        <div class="relative">
            <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search components..." 
                class="w-full pl-8 pr-3 py-1.5 text-sm glass-input bg-white/50 dark:bg-black/30 border-white/30 dark:border-white/10 focus:ring-2 focus:ring-blue-400/50 rounded-lg outline-none transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-2.5 top-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    </div>
    <div class="flex-1 overflow-y-auto p-2 space-y-2">
      <div v-for="group in filteredGroups" :key="group.title" class="glass-panel overflow-hidden">
        <div 
            @click="toggleGroup(group.title)"
            class="px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center justify-between cursor-pointer hover:bg-white/30 dark:hover:bg-white/10 transition-colors select-none"
        >
          <span>{{ group.title }}</span>
          <svg 
            v-if="!searchQuery"
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 transition-transform duration-300"
            :class="{ 'rotate-180': isGroupCollapsed(group.title) }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div 
            class="transition-all duration-300 ease-in-out overflow-hidden"
            :style="{ maxHeight: isGroupCollapsed(group.title) ? '0px' : '1000px', opacity: isGroupCollapsed(group.title) ? 0 : 1 }"
        >
            <draggable
            class="grid grid-cols-2 gap-2 p-2"
            :list="group.items"
            :group="{ name: 'components', pull: 'clone', put: false }"
            :clone="cloneComponent"
            item-key="type"
            :sort="false"
            >
            <template #item="{ element }">
                <div 
                    class="glass-button flex flex-col items-center justify-center p-3 cursor-pointer transition-all group hover:scale-105 hover:bg-white/90 dark:hover:bg-white/20"
                    @click="onComponentClick(element)"
                >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-6 w-6 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    v-html="getIconForType(element.type)"
                >
                </svg>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center leading-tight">{{ element.label }}</span>
                </div>
            </template>
            </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

