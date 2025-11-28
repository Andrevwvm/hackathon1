export const COMPONENT_GROUPS = [
  {
    title: 'Layout / Structure',
    items: [
      { type: 'section', label: 'Section', group: 'layout', defaultProps: { class: 'p-4 border border-dashed border-gray-300 min-h-[100px]' } },
      { type: 'row', label: 'Row', group: 'layout', defaultProps: { class: 'flex flex-row gap-2 p-2 border border-dashed border-gray-200 min-h-[50px]' } },
      { type: 'column', label: 'Column', group: 'layout', defaultProps: { class: 'flex flex-col gap-2 p-2 border border-dashed border-gray-200 min-h-[50px] flex-1' } },
      { type: 'card', label: 'Card', group: 'layout', defaultProps: { class: 'p-4 shadow rounded bg-white' } },
      { type: 'tabs', label: 'Tabs', group: 'layout' },
      { type: 'accordion', label: 'Accordion', group: 'layout' },
      { type: 'divider', label: 'Divider', group: 'layout' },
    ]
  },
  {
    title: 'Text & Display',
    items: [
      { type: 'heading', label: 'Heading', group: 'display', defaultProps: { text: 'Heading', level: 'h1' } },
      { type: 'text', label: 'Text', group: 'display', defaultProps: { text: 'Text block' } },
      { type: 'label', label: 'Label', group: 'display', defaultProps: { text: 'Label' } },
      { type: 'icon', label: 'Icon', group: 'display' },
      { type: 'image', label: 'Image', group: 'display' },
      { type: 'badge', label: 'Badge', group: 'display', defaultProps: { text: 'Badge' } },
      { type: 'chip', label: 'Chip', group: 'display', defaultProps: { text: 'Chip' } },
    ]
  },
  {
    title: 'Form Inputs',
    items: [
      { type: 'textInput', label: 'Text Input', group: 'form', defaultProps: { placeholder: 'Enter text...' } },
      { type: 'textarea', label: 'Textarea', group: 'form', defaultProps: { placeholder: 'Enter long text...' } },
      { type: 'numberInput', label: 'Number Input', group: 'form' },
      { type: 'passwordInput', label: 'Password', group: 'form' },
      { type: 'select', label: 'Select', group: 'form', defaultProps: { options: [{label: 'Option 1', value: '1'}] } },
      { type: 'multiSelect', label: 'Multi-select', group: 'form' },
      { type: 'radioGroup', label: 'Radio Group', group: 'form', defaultProps: { options: [{label: 'Option 1', value: '1'}] } },
      { type: 'checkbox', label: 'Checkbox', group: 'form', defaultProps: { label: 'Check me' } },
      { type: 'checkboxGroup', label: 'Checkbox Group', group: 'form' },
      { type: 'switch', label: 'Switch', group: 'form', defaultProps: { label: 'Toggle' } },
      { type: 'datePicker', label: 'Date Picker', group: 'form' },
      { type: 'timePicker', label: 'Time Picker', group: 'form' },
      { type: 'dateTimePicker', label: 'DateTime Picker', group: 'form' },
      { type: 'slider', label: 'Slider', group: 'form' },
      { type: 'fileUpload', label: 'File Upload', group: 'form' },
      { type: 'toggleButton', label: 'Toggle Button', group: 'form' },
    ]
  },
  {
    title: 'Actions',
    items: [
      { type: 'button', label: 'Button', group: 'action', defaultProps: { label: 'Button', variant: 'primary' } },
      { type: 'iconButton', label: 'Icon Button', group: 'action' },
      { type: 'link', label: 'Link', group: 'action', defaultProps: { label: 'Link', href: '#' } },
    ]
  },
  {
    title: 'Data & Lists',
    items: [
      { type: 'table', label: 'Table', group: 'data' },
      { type: 'list', label: 'List', group: 'data' },
      { type: 'kpi', label: 'KPI', group: 'data' },
      { type: 'progressBar', label: 'Progress Bar', group: 'data' },
      { type: 'stepper', label: 'Stepper', group: 'data' },
    ]
  }
];
