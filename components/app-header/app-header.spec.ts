import { shallowMount } from '@vue/test-utils';
import AppHeaderComponent from './app-header';

describe('AppHeaderComponent', () => {
  it('should app header', () => {
    const wrapper = shallowMount(AppHeaderComponent, {});
    wrapper.vm.onSwitchToRegister();
    expect(wrapper.vm.showLogin).toBeTruthy();
    expect(wrapper.vm.showRegister).toBeTruthy();
  });
});
