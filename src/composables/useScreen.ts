import { ref, computed } from 'vue';
import type { ScreenNode, Page } from '../types';
import LZString from 'lz-string';
import { v4 as uuidv4 } from 'uuid';

// State
const pages = ref<Page[]>([
    { id: uuidv4(), title: 'Page 1', children: [], props: {} }
]);
const activePageId = ref<string>(pages.value[0]?.id || '');
const selectedNodeId = ref<string | null>(null);
const isPreview = ref(false);

export function useScreen() {
  
  const activePage = computed(() => pages.value.find(p => p.id === activePageId.value) || pages.value[0]);

  // Computed 'screen' for backward compatibility and easy binding
  const screen = computed({
    get: () => activePage.value?.children || [],
    set: (nodes) => {
        const page = pages.value.find(p => p.id === activePageId.value);
        if (page) page.children = nodes;
    }
  });

  const findNode = (nodes: ScreenNode[], id: string): ScreenNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = computed(() => {
    if (!selectedNodeId.value) return null;
    return findNode(screen.value, selectedNodeId.value);
  });

  const addNode = (node: ScreenNode, parentId?: string) => {
    if (!parentId) {
      screen.value.push(node);
    } else {
      const parent = findNode(screen.value, parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      }
    }
  };

  const selectNode = (id: string | null) => {
    if (isPreview.value) return;
    selectedNodeId.value = id;
  };

  const deleteNode = (id: string) => {
     const remove = (nodes: ScreenNode[]) => {
        const index = nodes.findIndex(n => n.id === id);
        if (index !== -1) {
            nodes.splice(index, 1);
            return true;
        }
        for (const node of nodes) {
            if (node.children && remove(node.children)) return true;
        }
        return false;
     };
     remove(screen.value);
     if (selectedNodeId.value === id) selectedNodeId.value = null;
  };

  const updateNodeProps = (id: string, props: Record<string, any>) => {
      const node = findNode(screen.value, id);
      if (node) {
          node.props = { ...node.props, ...props };
      }
  };

  // Page Management
  const addPage = () => {
      const newPage: Page = {
          id: uuidv4(),
          title: `Page ${pages.value.length + 1}`,
          children: [],
          props: {}
      };
      pages.value.push(newPage);
      activePageId.value = newPage.id;
  };

  const deletePage = (id: string) => {
      if (pages.value.length <= 1) return; // Prevent deleting last page
      const index = pages.value.findIndex(p => p.id === id);
      if (index !== -1) {
          pages.value.splice(index, 1);
          if (activePageId.value === id) {
              activePageId.value = pages.value[Math.max(0, index - 1)]?.id || '';
          }
      }
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
      const page = pages.value.find(p => p.id === id);
      if (page) {
          Object.assign(page, updates);
      }
  };

  const clearScreen = () => {
      pages.value = [{ id: uuidv4(), title: 'Page 1', children: [], props: {} }];
      activePageId.value = pages.value[0]?.id || '';
      selectedNodeId.value = null;
  };

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pages.value, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "screen-design.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const parsed = JSON.parse(json);
        
        if (Array.isArray(parsed) && parsed.length > 0 && 'children' in parsed[0]) {
            pages.value = parsed;
        } else if (Array.isArray(parsed)) {
            pages.value = [{ id: uuidv4(), title: 'Page 1', children: parsed, props: {} }];
        } else {
             pages.value = [{ id: uuidv4(), title: 'Page 1', children: [], props: {} }];
        }
        activePageId.value = pages.value[0]?.id || '';
      } catch (error) {
        console.error("Invalid JSON file", error);
        alert("Failed to import JSON: Invalid format");
      }
    };
    reader.readAsText(file);
  };

  const togglePreview = () => {
    isPreview.value = !isPreview.value;
    if (isPreview.value) {
      selectedNodeId.value = null;
      activePageId.value = pages.value[0]?.id || '';
    }
  };

  const generateShareUrl = () => {
    const json = JSON.stringify(pages.value);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return `${window.location.origin}/#/?data=${compressed}`;
  };

  const duplicateNode = (id: string) => {
    const findAndDuplicate = (nodes: ScreenNode[]): boolean => {
      const index = nodes.findIndex(n => n.id === id);
      if (index !== -1) {
        const original = nodes[index];
        const newNode = JSON.parse(JSON.stringify(original));
        
        const updateIds = (node: ScreenNode) => {
            node.id = uuidv4();
            if (node.children) {
                node.children.forEach(updateIds);
            }
        };
        updateIds(newNode);
        
        nodes.splice(index + 1, 0, newNode);
        selectedNodeId.value = newNode.id;
        return true;
      }
      for (const node of nodes) {
        if (node.children && findAndDuplicate(node.children)) return true;
      }
      return false;
    };
    findAndDuplicate(screen.value);
  };

  const loadFromCompressed = (compressed: string) => {
    try {
      const json = LZString.decompressFromEncodedURIComponent(compressed);
      if (json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed) && parsed.length > 0 && 'children' in parsed[0]) {
            pages.value = parsed;
        } else {
            pages.value = [{ id: uuidv4(), title: 'Page 1', children: parsed, props: {} }];
        }
        activePageId.value = pages.value[0]?.id || '';
      }
    } catch (e) {
      console.error("Failed to load screen", e);
    }
  };

  const parseWidth = (width: string | number | undefined): number => {
    if (width === undefined) return 100;
    if (typeof width === 'number') return width <= 1 ? width * 100 : width;
    if (typeof width === 'string' && width.endsWith('%')) return parseFloat(width);
    return 100;
  };

  const handleSmartDrop = (nodes: ScreenNode[], newIndex: number) => {
    if (newIndex < 0 || newIndex >= nodes.length) return;
    
    let currentRowWidth = 0;
    for (let i = 0; i < newIndex; i++) {
      const node = nodes[i];
      if (!node) continue;
      const props = node.props || {};
      const w = parseWidth(props.width);
      if (currentRowWidth + w > 100.1) {
        currentRowWidth = w;
      } else {
        currentRowWidth += w;
      }
    }
    
    const freeSpace = 100 - currentRowWidth;
    const newWidth = freeSpace >= 5 ? `${Math.floor(freeSpace)}%` : '100%';
    
    if (nodes[newIndex]) {
        nodes[newIndex].props = { ...nodes[newIndex].props, width: newWidth };
    }
  };

  return {
    screen,
    pages,
    activePageId,
    activePage,
    selectedNodeId,
    selectedNode,
    isPreview,
    addNode,
    selectNode,
    deleteNode,
    duplicateNode,
    updateNodeProps,
    findNode,
    exportJson,
    importJson,
    togglePreview,
    generateShareUrl,
    loadFromCompressed,
    handleSmartDrop,
    addPage,
    deletePage,
    updatePage,
    clearScreen
  };
}
