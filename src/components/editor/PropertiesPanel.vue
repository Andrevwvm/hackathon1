<script setup lang="ts">
import { ref } from 'vue';
import { useScreen } from '../../composables/useScreen';

const { selectedNode, updateNodeProps } = useScreen();

const tabs = ['Basic', 'Layout', 'Style', 'Data', 'Events'];
const activeTab = ref('Basic');

const updateProp = (key: string, value: any) => {
  if (selectedNode.value) {
    updateNodeProps(selectedNode.value.id, { [key]: value });
  }
};
</script>

<template>
  <div class="h-full flex flex-col text-gray-800 dark:text-gray-200">
    <div class="p-4 border-b border-white/20 dark:border-white/10 flex justify-between items-center">
      <h2 class="font-bold text-lg">Properties</h2>
      <span v-if="selectedNode" class="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-mono">
        {{ selectedNode.type }}
      </span>
    </div>
    
    <div v-if="selectedNode" class="flex-1 flex flex-col overflow-hidden">
      <!-- Tabs -->
      <div class="flex border-b border-white/20 dark:border-white/10 overflow-x-auto scrollbar-hide">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap relative"
          :class="activeTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          {{ tab }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></div>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        
        <!-- Basic Tab -->
        <div v-if="activeTab === 'Basic'" class="space-y-4">
            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Identity</label>
                <div class="grid grid-cols-1 gap-2">
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">ID</label>
                        <input 
                            :value="selectedNode.id" 
                            disabled
                            class="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-transparent rounded-md text-sm text-gray-500 font-mono"
                        />
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Name / Label</label>
                        <input 
                            :value="selectedNode.props.label || selectedNode.props.text" 
                            @input="e => selectedNode && updateProp(selectedNode.type === 'heading' || selectedNode.type === 'text' ? 'text' : 'label', (e.target as HTMLInputElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            placeholder="Component Label"
                        />
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Settings</label>
                <div class="space-y-2">
                    <div v-if="['textInput', 'textarea'].includes(selectedNode.type)">
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Placeholder</label>
                        <input 
                            :value="selectedNode.props.placeholder" 
                            @input="e => updateProp('placeholder', (e.target as HTMLInputElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                    </div>
                    
                    <div v-if="selectedNode.type === 'button'">
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Variant</label>
                        <select 
                            :value="selectedNode.props.variant || 'primary'"
                            @change="e => updateProp('variant', (e.target as HTMLSelectElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        >
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                            <option value="outline">Outline</option>
                            <option value="ghost">Ghost</option>
                            <option value="danger">Danger</option>
                        </select>
                    </div>

                    <div v-if="selectedNode.type === 'textInput'">
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Input Type</label>
                        <select 
                            :value="selectedNode.props.inputType || 'text'"
                            @change="e => updateProp('inputType', (e.target as HTMLSelectElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        >
                            <option value="text">Text</option>
                            <option value="password">Password</option>
                            <option value="email">Email</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Tooltip</label>
                        <input 
                            :value="selectedNode.props.tooltip" 
                            @input="e => updateProp('tooltip', (e.target as HTMLInputElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">State</label>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            :checked="selectedNode.props.visible !== false"
                            @change="e => updateProp('visible', (e.target as HTMLInputElement).checked)"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">Visible</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            :checked="selectedNode.props.disabled"
                            @change="e => updateProp('disabled', (e.target as HTMLInputElement).checked)"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">Disabled</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            :checked="selectedNode.props.required"
                            @change="e => updateProp('required', (e.target as HTMLInputElement).checked)"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">Required</span>
                    </label>
                </div>
            </div>
        </div>

        <!-- Layout Tab -->
        <div v-if="activeTab === 'Layout'" class="space-y-4">
            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dimensions</label>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Width</label>
                        <input 
                            :value="selectedNode.props.width" 
                            @input="e => updateProp('width', (e.target as HTMLInputElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            placeholder="auto"
                        />
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Height</label>
                        <input 
                            :value="selectedNode.props.height" 
                            @input="e => updateProp('height', (e.target as HTMLInputElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            placeholder="auto"
                        />
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Spacing</label>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Margin</label>
                        <input 
                            :value="selectedNode.props.margin" 
                            @input="e => updateProp('margin', (e.target as HTMLInputElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            placeholder="0px"
                        />
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Padding</label>
                        <input 
                            :value="selectedNode.props.padding" 
                            @input="e => updateProp('padding', (e.target as HTMLInputElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            placeholder="0px"
                        />
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alignment</label>
                <div class="grid grid-cols-3 gap-2">
                    <button 
                        @click="updateProp('align', 'left')"
                        class="p-2 rounded border border-white/30 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10"
                        :class="selectedNode.props.align === 'left' ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : ''"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h16" />
                        </svg>
                    </button>
                    <button 
                        @click="updateProp('align', 'center')"
                        class="p-2 rounded border border-white/30 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10"
                        :class="selectedNode.props.align === 'center' ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : ''"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M4 18h16" />
                        </svg>
                    </button>
                    <button 
                        @click="updateProp('align', 'right')"
                        class="p-2 rounded border border-white/30 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10"
                        :class="selectedNode.props.align === 'right' ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : ''"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Style Tab -->
        <div v-if="activeTab === 'Style'" class="space-y-4">
            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Colors</label>
                <div class="grid grid-cols-1 gap-2">
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Text Color</label>
                        <div class="flex gap-2">
                            <input 
                                type="color"
                                :value="selectedNode.props.color || '#000000'" 
                                @input="e => updateProp('color', (e.target as HTMLInputElement).value)"
                                class="h-9 w-9 rounded cursor-pointer border border-white/30 dark:border-white/10"
                            />
                            <input 
                                :value="selectedNode.props.color" 
                                @input="e => updateProp('color', (e.target as HTMLInputElement).value)"
                                class="flex-1 px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                placeholder="#000000"
                            />
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Background Color</label>
                        <div class="flex gap-2">
                            <input 
                                type="color"
                                :value="selectedNode.props.backgroundColor || '#ffffff'" 
                                @input="e => updateProp('backgroundColor', (e.target as HTMLInputElement).value)"
                                class="h-9 w-9 rounded cursor-pointer border border-white/30 dark:border-white/10"
                            />
                            <input 
                                :value="selectedNode.props.backgroundColor" 
                                @input="e => updateProp('backgroundColor', (e.target as HTMLInputElement).value)"
                                class="flex-1 px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                placeholder="#ffffff"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Border</label>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Radius</label>
                        <input 
                            :value="selectedNode.props.borderRadius" 
                            @input="e => updateProp('borderRadius', (e.target as HTMLInputElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            placeholder="0px"
                        />
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Width</label>
                        <input 
                            :value="selectedNode.props.borderWidth" 
                            @input="e => updateProp('borderWidth', (e.target as HTMLInputElement).value)"
                            class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            placeholder="0px"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Data Tab -->
        <div v-if="activeTab === 'Data'" class="space-y-4">
            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Binding</label>
                <div>
                    <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Variable Name</label>
                    <input 
                        :value="selectedNode.props.model" 
                        @input="e => updateProp('model', (e.target as HTMLInputElement).value)"
                        class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono"
                        placeholder="userData.name"
                    />
                </div>
            </div>
            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Initial Value</label>
                <div>
                    <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Default Value</label>
                    <input 
                        :value="selectedNode.props.defaultValue" 
                        @input="e => updateProp('defaultValue', (e.target as HTMLInputElement).value)"
                        class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
            </div>
        </div>

        <!-- Events Tab -->
        <div v-if="activeTab === 'Events'" class="space-y-4">
            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</label>
                <div>
                    <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">On Click</label>
                    <textarea 
                        :value="selectedNode.props.onClick" 
                        @input="e => updateProp('onClick', (e.target as HTMLTextAreaElement).value)"
                        class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono h-24"
                        placeholder="// JavaScript code to execute"
                    ></textarea>
                </div>
                <div>
                    <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">On Change</label>
                    <textarea 
                        :value="selectedNode.props.onChange" 
                        @input="e => updateProp('onChange', (e.target as HTMLTextAreaElement).value)"
                        class="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono h-24"
                        placeholder="// JavaScript code to execute"
                    ></textarea>
                </div>
            </div>
        </div>

      </div>
    </div>
    
    <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <p class="text-sm">Select a component on the canvas to edit its properties</p>
    </div>
  </div>
</template>