<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class SecuredLayout extends Vue {
  public clipped = false;

  public drawer = false;

  public fixed = false;

  public items = [
    {
      icon: 'mdi-apps',
      title: 'Welcome',
      to: '/dashboard',
    },
  ];

  public miniVariant = false;

  public right = true;

  public rightDrawer = false;

  public title = 'Vuetify.js';
}
</script>
