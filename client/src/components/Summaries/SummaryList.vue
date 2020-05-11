<template>
  <v-layout justify-start fill-height>
    <v-flex xs6 sm7 md2>
      <v-list shaped>
        <v-list-item-group color="primary">
          <v-list-item class="pt-3" v-for="(summary, i) in summaries" :key="i">
            <v-list-item-icon>
              <v-icon>mdi-calendar-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{summary.startDate}} - {{summary.endDate}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-flex>
    <v-flex xs12 sm5 md10>
      <v-card dark color="green darken-1">
        <v-card-text>Summary will appear here</v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    summaries: [
      { startDate: "01/02/2020", endDate: "01/08/2020" },
      { startDate: "01/02/2020", endDate: "01/08/2020" },
      { startDate: "01/02/2020", endDate: "01/08/2020" },
      { startDate: "01/02/2020", endDate: "01/08/2020" },
      { startDate: "01/02/2020", endDate: "01/08/2020" },
      { startDate: "01/02/2020", endDate: "01/08/2020" },
      { startDate: "01/02/2020", endDate: "01/08/2020" }
    ]
  })
};
</script>

<style>
</style>