/**
 * Shoelace Component Helpers
 * Factory functions for creating Shoelace form elements with less boilerplate.
 *
 * This file imports Shoelace components directly, which esbuild bundles
 * into the output. This avoids runtime module resolution issues.
 */

// Import Shoelace components (esbuild will bundle these)
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';

// Set base path for Shoelace assets (icons, etc.)
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('/dist/shoelace');

/**
 * Create a Shoelace element with properties
 * @param {string} tag - Element tag (e.g., 'sl-button')
 * @param {Object} props - Properties to set on the element
 * @param {(string|Node)[]} children - Child content
 * @returns {HTMLElement}
 */
export function sl(tag, props = {}, children = []) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (key === 'class' || key === 'className') {
      el.className = value;
    } else if (key.startsWith('on')) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else {
      el[key] = value;
    }
  }

  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child) {
      el.appendChild(child);
    }
  }

  return el;
}

/**
 * Create an sl-input element
 * @param {Object} options
 * @param {string} [options.label] - Input label
 * @param {string} [options.type='text'] - Input type (text, email, password, number, etc.)
 * @param {string} [options.placeholder] - Placeholder text
 * @param {string} [options.value] - Initial value
 * @param {string} [options.name] - Form field name
 * @param {boolean} [options.required] - Whether field is required
 * @param {boolean} [options.disabled] - Whether field is disabled
 * @param {string} [options.helpText] - Help text shown below input
 * @param {string} [options.size='medium'] - Size (small, medium, large)
 * @param {boolean} [options.clearable] - Show clear button
 * @param {boolean} [options.passwordToggle] - Show password visibility toggle
 * @param {Function} [options.onInput] - Called on input (sl-input event)
 * @param {Function} [options.onChange] - Called on value commit (sl-change event)
 * @returns {HTMLElement}
 */
export function slInput({
  label,
  type = 'text',
  placeholder,
  value = '',
  name,
  required = false,
  disabled = false,
  helpText,
  size = 'medium',
  clearable = false,
  passwordToggle = false,
  onInput,
  onChange,
  ...props
} = {}) {
  const el = document.createElement('sl-input');

  if (label) el.label = label;
  if (type) el.type = type;
  if (placeholder) el.placeholder = placeholder;
  if (value) el.value = value;
  if (name) el.name = name;
  if (helpText) el.helpText = helpText;
  if (size !== 'medium') el.size = size;

  el.required = required;
  el.disabled = disabled;
  el.clearable = clearable;
  el.passwordToggle = passwordToggle;

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  if (onInput) el.addEventListener('sl-input', onInput);
  if (onChange) el.addEventListener('sl-change', onChange);

  return el;
}

/**
 * Create an sl-textarea element
 * @param {Object} options
 * @param {string} [options.label] - Textarea label
 * @param {string} [options.placeholder] - Placeholder text
 * @param {string} [options.value] - Initial value
 * @param {string} [options.name] - Form field name
 * @param {number} [options.rows=4] - Number of rows
 * @param {boolean} [options.required] - Whether field is required
 * @param {boolean} [options.disabled] - Whether field is disabled
 * @param {string} [options.helpText] - Help text shown below textarea
 * @param {string} [options.resize='vertical'] - Resize behavior
 * @param {Function} [options.onInput] - Called on input
 * @param {Function} [options.onChange] - Called on value commit
 * @returns {HTMLElement}
 */
export function slTextarea({
  label,
  placeholder,
  value = '',
  name,
  rows = 4,
  required = false,
  disabled = false,
  helpText,
  resize = 'vertical',
  onInput,
  onChange,
  ...props
} = {}) {
  const el = document.createElement('sl-textarea');

  if (label) el.label = label;
  if (placeholder) el.placeholder = placeholder;
  if (value) el.value = value;
  if (name) el.name = name;
  if (helpText) el.helpText = helpText;

  el.rows = rows;
  el.required = required;
  el.disabled = disabled;
  el.resize = resize;

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  if (onInput) el.addEventListener('sl-input', onInput);
  if (onChange) el.addEventListener('sl-change', onChange);

  return el;
}

/**
 * Create an sl-select element
 * @param {Object} options
 * @param {string} [options.label] - Select label
 * @param {string} [options.placeholder] - Placeholder text
 * @param {string|string[]} [options.value] - Selected value(s)
 * @param {string} [options.name] - Form field name
 * @param {Array<{value: string, label: string, disabled?: boolean}>} [options.options] - Options
 * @param {boolean} [options.required] - Whether field is required
 * @param {boolean} [options.disabled] - Whether field is disabled
 * @param {boolean} [options.multiple] - Allow multiple selection
 * @param {boolean} [options.clearable] - Show clear button
 * @param {string} [options.helpText] - Help text shown below select
 * @param {Function} [options.onChange] - Called on selection change
 * @returns {HTMLElement}
 */
export function slSelect({
  label,
  placeholder,
  value,
  name,
  options = [],
  required = false,
  disabled = false,
  multiple = false,
  clearable = false,
  helpText,
  onChange,
  ...props
} = {}) {
  const el = document.createElement('sl-select');

  if (label) el.label = label;
  if (placeholder) el.placeholder = placeholder;
  if (value !== undefined) el.value = value;
  if (name) el.name = name;
  if (helpText) el.helpText = helpText;

  el.required = required;
  el.disabled = disabled;
  el.multiple = multiple;
  el.clearable = clearable;

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  // Add options
  options.forEach((opt) => {
    const option = document.createElement('sl-option');
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.disabled) option.disabled = true;
    el.appendChild(option);
  });

  if (onChange) el.addEventListener('sl-change', onChange);

  return el;
}

/**
 * Create an sl-checkbox element
 * @param {Object} options
 * @param {string} [options.label] - Checkbox label (shown as text content)
 * @param {boolean} [options.checked] - Whether checked
 * @param {string} [options.name] - Form field name
 * @param {boolean} [options.disabled] - Whether disabled
 * @param {Function} [options.onChange] - Called on change
 * @returns {HTMLElement}
 */
export function slCheckbox({
  label,
  checked = false,
  name,
  disabled = false,
  onChange,
  ...props
} = {}) {
  const el = document.createElement('sl-checkbox');

  if (name) el.name = name;
  el.checked = checked;
  el.disabled = disabled;
  if (label) el.textContent = label;

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  if (onChange) el.addEventListener('sl-change', onChange);

  return el;
}

/**
 * Create an sl-switch element
 * @param {Object} options
 * @param {string} [options.label] - Switch label
 * @param {boolean} [options.checked] - Whether checked
 * @param {string} [options.name] - Form field name
 * @param {boolean} [options.disabled] - Whether disabled
 * @param {Function} [options.onChange] - Called on change
 * @returns {HTMLElement}
 */
export function slSwitch({
  label,
  checked = false,
  name,
  disabled = false,
  onChange,
  ...props
} = {}) {
  const el = document.createElement('sl-switch');

  if (name) el.name = name;
  el.checked = checked;
  el.disabled = disabled;
  if (label) el.textContent = label;

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  if (onChange) el.addEventListener('sl-change', onChange);

  return el;
}

/**
 * Create an sl-button element
 * @param {Object} options
 * @param {string} [options.label] - Button text
 * @param {string} [options.variant='default'] - Variant (default, primary, success, warning, danger, text)
 * @param {string} [options.size='medium'] - Size (small, medium, large)
 * @param {boolean} [options.disabled] - Whether disabled
 * @param {boolean} [options.loading] - Whether showing loading state
 * @param {boolean} [options.outline] - Outline style
 * @param {string} [options.type='button'] - Button type (button, submit, reset)
 * @param {string} [options.prefixIcon] - Icon name for prefix slot
 * @param {string} [options.suffixIcon] - Icon name for suffix slot
 * @param {Function} [options.onClick] - Click handler
 * @returns {HTMLElement}
 */
export function slButton({
  label,
  variant = 'default',
  size = 'medium',
  disabled = false,
  loading = false,
  outline = false,
  type = 'button',
  prefixIcon,
  suffixIcon,
  onClick,
  ...props
} = {}) {
  const el = document.createElement('sl-button');

  el.variant = variant;
  if (size !== 'medium') el.size = size;
  el.type = type;
  el.disabled = disabled;
  el.loading = loading;
  el.outline = outline;

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  if (prefixIcon) {
    const icon = document.createElement('sl-icon');
    icon.name = prefixIcon;
    icon.slot = 'prefix';
    el.appendChild(icon);
  }

  if (label) {
    el.appendChild(document.createTextNode(label));
  }

  if (suffixIcon) {
    const icon = document.createElement('sl-icon');
    icon.name = suffixIcon;
    icon.slot = 'suffix';
    el.appendChild(icon);
  }

  if (onClick) el.addEventListener('click', onClick);

  return el;
}

/**
 * Create an sl-icon-button element
 * @param {Object} options
 * @param {string} options.name - Icon name (required)
 * @param {string} [options.label] - Accessible label
 * @param {boolean} [options.disabled] - Whether disabled
 * @param {Function} [options.onClick] - Click handler
 * @returns {HTMLElement}
 */
export function slIconButton({
  name,
  label,
  disabled = false,
  onClick,
  ...props
} = {}) {
  const el = document.createElement('sl-icon-button');

  el.name = name;
  if (label) el.label = label;
  el.disabled = disabled;

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  if (onClick) el.addEventListener('click', onClick);

  return el;
}

/**
 * Create an sl-icon element
 * @param {Object} options
 * @param {string} options.name - Icon name
 * @returns {HTMLElement}
 */
export function slIcon({ name, ...props } = {}) {
  const el = document.createElement('sl-icon');
  el.name = name;

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  return el;
}

/**
 * Create an sl-spinner element
 * @param {Object} options
 * @returns {HTMLElement}
 */
export function slSpinner(props = {}) {
  const el = document.createElement('sl-spinner');

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  return el;
}

/**
 * Create an sl-alert element
 * @param {Object} options
 * @param {string} options.message - Alert message
 * @param {string} [options.variant='primary'] - Variant (primary, success, neutral, warning, danger)
 * @param {boolean} [options.open=true] - Whether visible
 * @param {boolean} [options.closable] - Whether closable
 * @param {string} [options.icon] - Icon name to display
 * @param {number} [options.duration] - Auto-close duration in ms
 * @returns {HTMLElement}
 */
export function slAlert({
  message,
  variant = 'primary',
  open = true,
  closable = false,
  icon,
  duration,
  ...props
} = {}) {
  const el = document.createElement('sl-alert');

  el.variant = variant;
  el.open = open;
  el.closable = closable;
  if (duration !== undefined) el.duration = duration;

  Object.entries(props).forEach(([key, val]) => {
    el[key] = val;
  });

  if (icon) {
    const iconEl = document.createElement('sl-icon');
    iconEl.name = icon;
    iconEl.slot = 'icon';
    el.appendChild(iconEl);
  }

  el.appendChild(document.createTextNode(message));

  return el;
}
