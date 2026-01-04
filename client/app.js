/**
 * Vibekit Application
 * Entry point for the client-side app.
 */

import { route, notFound, startRouter, navigate } from './lib/router.js';
import { initTheme, createThemeToggle } from './lib/theme.js';
import { $, h, empty } from './lib/dom.js';
import { renderSettings } from './views/settings.js';
import { success, error, warning, info } from './lib/toast.js';
import { confirm, alert, prompt } from './lib/dialogs.js';

// Import Shoelace helpers - this registers the Shoelace components
import { slInput, slButton, slSelect, slSwitch, slTextarea } from './lib/shoelace.js';

// Initialize theme
initTheme();

// Get app container
const app = $('#app');

/**
 * Render the app shell with content
 */
function renderShell(content, { activeNav = '' } = {}) {
  empty(app);

  const shell = h('div', { class: 'vk-shell-header' }, [
    // Header
    h('header', { class: 'vk-header' }, [
      h('a', { href: '/', class: 'vk-header-logo' }, ['Vibekit']),

      h('nav', { class: 'vk-header-nav' }, [
        h('a', {
          href: '/',
          class: activeNav === 'home' ? 'is-active' : '',
        }, ['Home']),
        h('a', {
          href: '/settings',
          class: activeNav === 'settings' ? 'is-active' : '',
        }, ['Settings']),
      ]),

      h('div', { class: 'vk-header-spacer' }),

      h('div', { class: 'vk-header-actions' }, [
        createThemeToggle(),
      ]),
    ]),

    // Main content
    h('main', { id: 'main', class: 'vk-main' }, [content]),
  ]);

  app.appendChild(shell);
}

/**
 * Render the welcome/demo page
 */
function renderWelcome(container) {
  // Create a dialog for the modal demo
  const dialog = h('sl-dialog', { label: 'Example Modal' }, [
    h('p', {}, ['This is a modal dialog. It traps focus and can be closed with Escape or the X button.']),
    h('div', { style: 'margin-top: var(--vk-space-4);' }, [
      slInput({
        label: 'Your Name',
        placeholder: 'Enter your name',
        helpText: 'This is just a demo input',
      }),
    ]),
    h('div', { slot: 'footer', style: 'display: flex; gap: var(--vk-space-2); justify-content: flex-end;' }, [
      slButton({
        label: 'Cancel',
        variant: 'default',
        onClick: () => dialog.hide(),
      }),
      slButton({
        label: 'Save',
        variant: 'primary',
        onClick: () => {
          dialog.hide();
          success('Changes saved!');
        },
      }),
    ]),
  ]);

  const content = h('div', { class: 'vk-welcome' }, [
    h('div', { class: 'vk-welcome-header' }, [
      h('h1', {}, ['Vibekit Component Demo']),
      h('p', { class: 'text-secondary' }, [
        'Interactive examples of the UI components available in Vibekit.',
      ]),
    ]),

    h('div', { class: 'vk-welcome-grid' }, [
      // Buttons & Dialogs
      h('div', { class: 'vk-card' }, [
        h('div', { class: 'vk-card-header' }, [
          h('sl-icon', { name: 'hand-index', style: 'font-size: 1.5rem; color: var(--sl-color-primary-600);' }),
          h('h2', {}, ['Buttons & Dialogs']),
        ]),
        h('div', { class: 'vk-card-body' }, [
          h('div', { class: 'vk-button-group', style: 'margin-bottom: var(--vk-space-4);' }, [
            slButton({
              label: 'Open Modal',
              variant: 'primary',
              prefixIcon: 'box-arrow-up-right',
              onClick: () => dialog.show(),
            }),
            slButton({
              label: 'Confirm Dialog',
              variant: 'default',
              onClick: async () => {
                const confirmed = await confirm({
                  title: 'Confirm Action',
                  message: 'Are you sure you want to proceed with this action?',
                  confirmText: 'Yes, proceed',
                  cancelText: 'Cancel',
                });
                if (confirmed) {
                  success('Action confirmed!');
                } else {
                  info('Action cancelled');
                }
              },
            }),
          ]),
          h('div', { class: 'vk-button-group' }, [
            slButton({
              label: 'Alert',
              variant: 'warning',
              onClick: () => alert({ title: 'Alert', message: 'This is an alert dialog.' }),
            }),
            slButton({
              label: 'Prompt',
              variant: 'neutral',
              onClick: async () => {
                const value = await prompt({
                  title: 'Enter Value',
                  label: 'What is your favorite color?',
                  placeholder: 'e.g., Blue',
                });
                if (value) {
                  success(`You entered: ${value}`);
                }
              },
            }),
          ]),
        ]),
      ]),

      // Toast Notifications
      h('div', { class: 'vk-card' }, [
        h('div', { class: 'vk-card-header' }, [
          h('sl-icon', { name: 'bell', style: 'font-size: 1.5rem; color: var(--sl-color-primary-600);' }),
          h('h2', {}, ['Toast Notifications']),
        ]),
        h('div', { class: 'vk-card-body' }, [
          h('div', { class: 'vk-button-group' }, [
            slButton({
              label: 'Success',
              variant: 'success',
              onClick: () => success('Operation completed successfully!'),
            }),
            slButton({
              label: 'Error',
              variant: 'danger',
              onClick: () => error('Something went wrong. Please try again.'),
            }),
            slButton({
              label: 'Warning',
              variant: 'warning',
              onClick: () => warning('Please review your input before continuing.'),
            }),
            slButton({
              label: 'Info',
              variant: 'neutral',
              onClick: () => info('Here is some helpful information.'),
            }),
          ]),
        ]),
      ]),

      // Form Elements
      h('div', { class: 'vk-card' }, [
        h('div', { class: 'vk-card-header' }, [
          h('sl-icon', { name: 'input-cursor-text', style: 'font-size: 1.5rem; color: var(--sl-color-primary-600);' }),
          h('h2', {}, ['Form Elements']),
        ]),
        h('div', { class: 'vk-card-body' }, [
          h('div', { style: 'display: flex; flex-direction: column; gap: var(--vk-space-4);' }, [
            slInput({
              label: 'Text Input',
              placeholder: 'Enter some text',
              clearable: true,
            }),
            slSelect({
              label: 'Select',
              placeholder: 'Choose an option',
              options: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
              ],
            }),
            slTextarea({
              label: 'Textarea',
              placeholder: 'Enter multiple lines of text',
              rows: 3,
            }),
            h('div', { style: 'display: flex; gap: var(--vk-space-6);' }, [
              slSwitch({
                label: 'Enable feature',
                checked: true,
              }),
              slSwitch({
                label: 'Dark mode',
              }),
            ]),
          ]),
        ]),
      ]),

      // Icons & Buttons
      h('div', { class: 'vk-card' }, [
        h('div', { class: 'vk-card-header' }, [
          h('sl-icon', { name: 'palette', style: 'font-size: 1.5rem; color: var(--sl-color-primary-600);' }),
          h('h2', {}, ['Button Variants']),
        ]),
        h('div', { class: 'vk-card-body' }, [
          h('div', { class: 'vk-button-group', style: 'margin-bottom: var(--vk-space-4);' }, [
            h('sl-button', { variant: 'primary' }, ['Primary']),
            h('sl-button', { variant: 'success' }, ['Success']),
            h('sl-button', { variant: 'warning' }, ['Warning']),
            h('sl-button', { variant: 'danger' }, ['Danger']),
            h('sl-button', { variant: 'neutral' }, ['Neutral']),
          ]),
          h('div', { class: 'vk-button-group', style: 'margin-bottom: var(--vk-space-4);' }, [
            h('sl-button', { variant: 'primary', outline: true }, ['Outline']),
            h('sl-button', { variant: 'primary', pill: true }, ['Pill']),
            h('sl-button', { variant: 'default', disabled: true }, ['Disabled']),
            h('sl-button', { variant: 'primary', loading: true }, ['Loading']),
          ]),
          h('div', { class: 'vk-button-group' }, [
            h('sl-icon-button', { name: 'pencil', label: 'Edit' }),
            h('sl-icon-button', { name: 'trash', label: 'Delete' }),
            h('sl-icon-button', { name: 'download', label: 'Download' }),
            h('sl-icon-button', { name: 'share', label: 'Share' }),
            h('sl-icon-button', { name: 'gear', label: 'Settings' }),
          ]),
        ]),
      ]),
    ]),

    // Add the dialog to the DOM
    dialog,
  ]);

  container.appendChild(content);
}

/**
 * Render a not found page
 */
function render404() {
  const content = h('div', { class: 'text-center py-4' }, [
    h('h1', { class: 'text-2xl mb-4' }, ['Page Not Found']),
    h('p', { class: 'text-secondary mb-6' }, ['The page you are looking for does not exist.']),
    h('sl-button', {
      variant: 'primary',
      onclick: () => navigate('/'),
    }, ['Go Home']),
  ]);

  renderShell(content);
}

// Define routes

// Home page
route('/', () => {
  const content = h('div', {});
  renderShell(content, { activeNav: 'home' });
  renderWelcome(content);
});

// Settings
route('/settings', async () => {
  const content = h('div', {});
  renderShell(content, { activeNav: 'settings' });
  return renderSettings(content);
});

// 404 handler
notFound(() => {
  render404();
});

// Start the router
startRouter();
