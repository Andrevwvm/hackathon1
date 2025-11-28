export type ComponentType = 
  | 'section' | 'row' | 'column' | 'card' | 'tabs' | 'accordion' | 'divider'
  | 'heading' | 'text' | 'label' | 'icon' | 'image' | 'badge' | 'chip'
  | 'textInput' | 'textarea' | 'numberInput' | 'passwordInput' | 'select' | 'multiSelect'
  | 'radioGroup' | 'checkbox' | 'checkboxGroup' | 'switch' | 'datePicker' | 'timePicker' | 'dateTimePicker'
  | 'slider' | 'fileUpload' | 'toggleButton'
  | 'button' | 'iconButton' | 'link'
  | 'table' | 'list' | 'kpi' | 'progressBar' | 'stepper';

export interface ScreenNode {
  id: string;
  type: ComponentType | string;
  props: Record<string, any>;
  children?: ScreenNode[];
  bindings?: Record<string, string>;
  events?: Record<string, {
    type: string;
    payload?: any;
  }>;
}

export interface Page {
  id: string;
  title: string;
  description?: string;
  children: ScreenNode[];
  props: Record<string, any>;
}

export interface ComponentDefinition {
  type: ComponentType | string;
  label: string;
  group: string;
  icon?: string;
  defaultProps?: Record<string, any>;
}
