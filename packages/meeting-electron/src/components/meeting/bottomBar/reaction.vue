<template>
  <section id="reaction-btn">
    <v-menu
      v-model="showMenu"
      :close-on-content-click="false"
      top
      max-height="300"
      nudge-top="55"
      attach="#reaction-btn"
    >
      <template #activator="{ on, attrs }">
        <section>
          <v-btn
            :ripple="false"
            class="pl-1 pr-1 flex-column align-center"
            min-width="70"
            height="56"
            light
            v-bind="attrs"
            v-on="on"
          >
            <span class="normal-text title-center">{{
              $vuetify.lang.t('$vuetify.meeting.reaction')
            }}</span>
            <img
              alt=""
              class="bottom-bar-img"
              width="18"
              height="18"
              src="@/assets/bottom_btn/emiji.png"
            />
          </v-btn>
        </section>
      </template>
      <v-list class="reaction-bottom pa-0" dense>
        <v-list-item class="reaction-item">
          <v-btn
            v-for="(name, index) in reactionList"
            :key="index"
            text
            min-width="20"
            class="pa-0"
            @click="onClickReaction(name)"
          >
            <v-img
              max-width="20"
              max-height="25"
              :src="require(`@/assets/reactions/${name}.png`)"
            />
          </v-btn>
        </v-list-item>
        <v-list-item class="reaction-item hand-up">
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <v-btn text outlined class="hand-btn" width="200" @click="onHandUp">
            <img alt="" width="16" :src="require('@/assets/hand_color.png')" />
            <span class="normal-text pl-2">
              {{
                hand
                  ? $vuetify.lang.t('$vuetify.meeting.handDown')
                  : $vuetify.lang.t('$vuetify.meeting.handUp')
              }}
            </span>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </section>
</template>

<script>
import { CustomEvents, Reactions } from '../../../common'
import { mapMutations } from 'vuex'

export default {
  name: 'Reaction',
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      showMenu: false,
      reactionList: Reactions,
      hand: false
    }
  },
  watch: {
    show(val) {
      this.showMenu = val
    }
  },
  mounted() {
    this.showMenu = this.show
  },
  methods: {
    ...mapMutations('meeting', ['updateReaction', 'delReaction']),
    onClickReaction(name) {
      window.meetingRoomCore.sendCustomEvent(name)
      const reaction = {
        senderId: window.meetingRoomCore.user.id,
        content: name
      }
      this.updateReaction(reaction)
      setTimeout(() => {
        this.delReaction(window.meetingRoomCore.user.id)
      }, 10000)
      // this.$emit('reaction', name, this.userId);
      // this.$eventBus.$emit(CustomEvents.REACTION, name, this.userId)
    },
    onHandUp() {}
  }
}
</script>

<style lang="scss" scoped>
#reaction-btn {
  ::v-deep .v-menu__content {
    top: -73px !important;
  }
  .bottom-bar-img {
    margin-bottom: 4.5px;
  }
  .reaction-bottom {
    display: flex;
    align-items: center;
    flex-direction: column;
    .reaction-item {
      justify-content: space-between;
      display: flex;
      width: 200px;
    }
    .hand-up {
      width: 200px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-content: center;
      .hand-btn {
        display: flex;
        justify-content: center;
        align-content: center;
      }
      ::v-deep .v-btn__content {
        flex-direction: row !important;
      }
    }
  }
}
</style>
