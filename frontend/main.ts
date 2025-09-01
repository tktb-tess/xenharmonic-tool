import { mount } from 'svelte';
import App from './app.svelte';

const elem = (() => {
  const app_ = document.getElementById('app');
  if (!app_) throw Error('cannot get Element');
  return app_;
})();

const app = mount(App, { target: elem });

export default app;
