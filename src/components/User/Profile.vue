<template>
    <v-layout row mt-5>
        <v-flex xs12 md6 offset-md3 class="text-xs-center">

            <v-list>
                <v-list-tile >
                        <v-list-tile-action>
                        <v-icon>email</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                        <v-list-tile-title class="dark">
                            <span>{{ user.email }}</span>
                        </v-list-tile-title>
                        </v-list-tile-content>
                </v-list-tile>
                    
                <v-list-tile >
                    <v-list-tile-action>
                        <v-icon>date_range</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                        <v-list-tile-title class="dark">
                            <span>Date joined: {{ user.registeredAt | date }}</span>
                        </v-list-tile-title>
                        </v-list-tile-content>
                </v-list-tile>

                <v-list-tile >
                    <v-list-tile-action>
                        <v-icon>access_time</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                        <v-list-tile-title class="dark">
                            <span>Last sign in: {{ user.lastSignInAt | date}}</span>
                        </v-list-tile-title>
                        </v-list-tile-content>
                </v-list-tile>


                <v-list-tile >
                    <v-list-tile-action>
                        <v-icon>list</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                        <v-list-tile-title class="dark">
                            <span>Total number of snippets: {{ snippets.length}}</span>
                        </v-list-tile-title>
                        </v-list-tile-content>
                </v-list-tile>
            </v-list>


           
        </v-flex>
    </v-layout>
</template>
<script>

export default {
    computed: {
        user() {
            return this.$store.getters.user
        },

        snippets() {
            return this.$store.getters.loadedSnippets
        }
    }
}
</script>
