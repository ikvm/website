import { mapGetters } from 'vuex'

export default {
  data: () => ({
    on: false
  }),

  beforeRouteEnter(to, from, next) {
    next(vm => vm.$store.getters.loggedIn ? next() : next('/login'))
  },

  computed: {
    ...mapGetters(['loggedIn'])
  },

  updated() {
    if (!this.loggedIn) {
      this.$router.push('/login')
    }
  }
}
