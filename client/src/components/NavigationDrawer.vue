<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app :mini-variant.sync="mini" permanent color="blue">
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src></v-img>
        </v-list-item-avatar>

        <v-list-item-title>User</v-list-item-title>
        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.path">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "Home", icon: "mdi-home-city", path: "/" },
        { title: "Profile", icon: "mdi-account", path: "/profile" },
        {
          title: "Summaries",
          icon: "mdi-text-box-multiple-outline",
          path: "/summaries"
        }
      ],
      mini: true
    };
  }
};
</script>
<style></style>
