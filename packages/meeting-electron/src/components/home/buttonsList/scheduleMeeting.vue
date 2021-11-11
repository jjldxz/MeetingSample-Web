<template>
  <div id="schedule-meeting">
    <v-system-bar color="white">
      <v-icon size="16" color="black" @click="onClose">mdi-close</v-icon>
    </v-system-bar>
    <div class="schedule-main">
      <v-form id="scheduleMeetingForm" v-model="scheduleMeetingForm">
        <div class="pt-4">
          <span class="meeting-title">{{
            $vuetify.lang.t('$vuetify.meeting.meetingTopic')
          }}</span>
          <v-text-field
            v-model="meetingTopic"
            :placeholder="$vuetify.lang.t('$vuetify.meeting.enterMeetingTopic')"
            type="text"
            :rules="[rules.required]"
            solo
            outlined
            class="white--text"
            color="#127BF8"
            dense
            flat
            clearable
          />
        </div>
        <div class="text-border-content">
          <span class="meeting-title">{{
            $vuetify.lang.t('$vuetify.meeting.startTime')
          }}</span>
          <div class="d-flex justify-space-between">
            <v-menu
              ref="startDatePicker"
              v-model="startDatePicker"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
              value="startDatePicker"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFormatted"
                  color="#127BF8"
                  background-color="#f8f8f8"
                  persistent-hint
                  prepend-inner-icon="mdi-calendar"
                  v-bind="attrs"
                  hide-details
                  readonly
                  dense
                  solo
                  flat
                  outlined
                  @blur="date = parseDate(dateFormatted)"
                  v-on="on"
                >
                  <template slot="append">
                    <div>
                      <v-icon
                        :class="startDatePicker ? ' clockwise' : ''"
                        :color="startDatePicker ? '#127BF8' : ''"
                        @click="startDatePicker = !startDatePicker"
                        >mdi-menu-down</v-icon
                      >
                    </div>
                  </template>
                  <template slot="prepend-inner" class="flex-center">
                    <div class="d-icon mr-1">
                      <img alt src="@/assets/cal.svg" />
                    </div>
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                :min="minDate"
                color="#127BF8"
                :locale="timePickerLocale"
                @click.native="onPickerDateClick($event)"
              />
            </v-menu>
            <div style="width: 50%" class="start-content">
              <v-select
                v-model="startTime"
                :items="timeList"
                :menu-props="{ offsetY: true, maxHeight: '200' }"
                hide-details
                outlined
                solo
                flat
                dense
                background-color="#f8f8f8"
                class="white--text ml-2"
                color="#127BF8"
              >
                <template #item="{ item, on, attrs }">
                  <v-list-item
                    v-bind="attrs"
                    style="height: 30px; min-height: 30px"
                    v-on="on"
                  >
                    <v-list-item-content>
                      {{ item }}
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  <div>{{ getStartTimeStr(item) }}</div>
                </template>
                <template slot="prepend-inner" class="flex-center">
                  <div class="d-icon">
                    <img alt src="@/assets/time.svg" />
                  </div>
                </template>
              </v-select>
            </div>
          </div>
          <div class="pt-2 error-text">
            <span v-if="startTimeRulesText" class="ml-2">{{ startTimeRulesText }}</span>
          </div>
        </div>
        <div class="text-border-content start-content">
          <v-text-field
            v-model="timeZone"
            disabled
            hide-details
            outlined
            solo
            dense
            background-color="#f8f8f8"
            flat
            item-value="index"
            class="white--text"
            color="#127BF8"
          >
            <template slot="prepend-inner" class="flex-center">
              <div class="d-icon mr-1">
                <img alt src="@/assets/timezone.png" width="20" height="20" />
              </div>
            </template>
          </v-text-field>
        </div>
        <div class="text-border-content start-content mt-6">
          <span class="meeting-title">{{
            $vuetify.lang.t('$vuetify.meeting.selectMeetingLength')
          }}</span>
          <v-select
            v-model="meetingDuration"
            :items="durationList"
            :menu-props="{ offsetY: true, maxHeight: '300' }"
            hide-details
            outlined
            solo
            dense
            background-color="#f8f8f8"
            flat
            item-value="index"
            class="white--text"
            color="#127BF8"
          >
            <template slot="prepend-inner" class="flex-center">
              <div class="d-icon">
                <img alt src="@/assets/during.svg" />
              </div>
            </template>
            <template #item="{ item, on, attrs }">
              <v-list-item
                v-bind="attrs"
                style="height: 30px; min-height: 30px"
                v-on="on"
              >
                <v-list-item-title>
                  {{
                    `${item.time} ${
                      item.unit === 'minutes'
                        ? $vuetify.lang.t('$vuetify.meeting.minutes')
                        : $vuetify.lang.t('$vuetify.meeting.hours')
                    }`
                  }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <div>
                {{
                  `${item.time} ${
                    item.unit === 'minutes'
                      ? $vuetify.lang.t('$vuetify.meeting.minutes')
                      : $vuetify.lang.t('$vuetify.meeting.hours')
                  }`
                }}
              </div>
            </template>
          </v-select>
        </div>
        <div class="pt-6">
          <div class="bottom-content d-flex align-center">
            <v-checkbox
              v-model="addCalendarFlag"
              class="mt-0"
              off-icon="mdi-square"
              :label="$vuetify.lang.t('$vuetify.meeting.calendar')"
            />
            <div class="addcalendar-remind pl-3">
              {{ $vuetify.lang.t('$vuetify.meeting.calendarReminder') }}
            </div>
          </div>
          <div class="bottom-content">
            <v-checkbox
              v-model="needPassword"
              class="mt-0"
              off-icon="mdi-square"
              :label="$vuetify.lang.t('$vuetify.meeting.joinMeetingPassword')"
            />
          </div>
          <v-text-field
            v-show="needPassword"
            v-model="meetingPassword"
            class="pt-1"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.min]"
            oninput="value = value.replace(/[\u4E00-\u9FA5]/g,'')"
            solo
            outlined
            sd
            dense
            color="#127BF8"
            flat
            :placeholder="$vuetify.lang.t('$vuetify.meeting.enterPassword')"
            @click:append="showPassword = !showPassword"
          />
        </div>
        <div class="bottom-content">
          <v-checkbox
            v-model="muteType"
            class="mt-0"
            off-icon="mdi-square"
            :label="$vuetify.lang.t('$vuetify.meeting.muteAttendeesUponEntry')"
          />
        </div>
      </v-form>
      <div class="pt-4 pb-4">
        <v-btn
          block
          :disabled="
            !!startTimeRulesText ||
            !meetingTopic ||
            !startTime ||
            (needPassword && !(meetingPassword && meetingPassword.length >= 6))
          "
          class="white--text"
          color="#127BF8"
          depressed
          @click="onScheduleMeeting"
          >{{ $vuetify.lang.t('$vuetify.meeting.scheduledMeeting') }}</v-btn
        >
      </div>
    </div>

    <v-overlay :opacity="0.3" :value="scheduleLoading">
      <v-progress-circular indeterminate size="64" color="light-blue" />
    </v-overlay>
    <v-snackbar v-model="snackbar" timeout="2000" centered>
      {{ startTimeRulesText }}
    </v-snackbar>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import { formatDate, getTimes, getTimeStr } from '../../../utils'
import { CustomEvents, TIME_ZONE } from '../../../common'
import { mapState } from 'vuex'
import { boolToNumber } from '@jjldxz/meeting-core-electron/src/utils'
import AddScheduleToCalendar from '../../../composables/addScheduleToCalendar'
import { ErrorCode } from '../../../common/error'

export default {
  name: 'ScheduleMeeting',
  data: (vm) => {
    return {
      timeZone: null,
      meetingTopic: null,
      scheduleMeetingForm: false,
      date: null,
      dateFormatted: null,
      minDate: null,
      startDatePicker: false,
      timePickerLocale: null,
      startTime: null,
      timeList: getTimes(),
      startTimeRulesText: null,
      meetingDuration: 3,
      addCalendarFlag: true,
      durationList: [
        { time: 30, unit: 'minutes', index: 0 },
        { time: 60, unit: 'minutes', index: 1 },
        { time: 90, unit: 'minutes', index: 2 },
        { time: 2, unit: 'hour', index: 3 },
        { time: 3, unit: 'hour', index: 4 },
        { time: 4, unit: 'hour', index: 5 },
        { time: 5, unit: 'hour', index: 6 }
      ],
      needPassword: false,
      showPassword: false,
      meetingPassword: null,
      muteType: false,
      scheduleLoading: false,
      snackbar: false,
      rules: {
        required: (value) =>
          !!value ||
          (typeof value === 'string' && !!value) ||
          vm.$vuetify.lang.t('$vuetify.meeting.required'),
        min: (v) =>
          (v && typeof v === 'string' && v.length >= 6) ||
          vm.$vuetify.lang.t('$vuetify.meeting.minSixCharacters')
      }
    }
  },
  computed: {
    ...mapState('users', ['loginUserInfo'])
  },
  beforeMount() {
    this.meetingTopic = this.$vuetify.lang.t(
      '$vuetify.meeting.defaultMeetingTopic',
      this.loginUserInfo.username
    )
    this.init()
  },
  mounted() {},
  methods: {
    formatDate(date) {
      return formatDate(date, '-', '/')
    },
    parseDate(date) {
      return formatDate(date, '/', '-')
    },
    onPickerDateClick(e) {
      if (
        e.target.innerText ===
        document.getElementsByClassName('v-btn--active')[0].innerText
      ) {
        this.startDatePicker = false
      }
    },
    getStartTimeStr(item) {
      let locale = ''
      locale = this.$vuetify.lang.current === 'zhHans'
      return getTimeStr(item, locale)
    },
    onScheduleMeeting() {
      const tmp = `${this.date} ${this.startTime}`
      const startTime = moment(tmp).tz(TIME_ZONE).utc().format()
      if (this.dateIsBeforeCurrent(startTime)) {
        this.startTimeRulesText = this.$vuetify.lang.t(
          '$vuetify.meeting.scheduleTimeCheck'
        )
        this.snackbar = true
      } else {
        let endTime = moment(tmp)
          .add(
            this.durationList[this.meetingDuration].time,
            this.durationList[this.meetingDuration].unit
          )
          .tz(TIME_ZONE)
        let opts = { muteType: boolToNumber(this.muteType) }
        this.needPassword && (opts.password = this.meetingPassword)
        this.scheduleLoading = true
        window.meetingCore
          .createMeeting(this.meetingTopic, startTime, endTime, opts)
          .then((res) => {
            this.$eventBus.$emit(CustomEvents.UPDATE_MEETING_LIST)
            this.scheduleLoading = false
            if (this.addCalendarFlag) {
              AddScheduleToCalendar(
                res.call_number,
                this.loginUserInfo.username,
                this.$vuetify
              )
            }
            this.onClose()
          })
          .catch((e) => {
            console.error(e)
            this.scheduleLoading = false
            if (e && e.code === ErrorCode.TOKEN_EXPIRED) {
              this.$emit('error', this.$vuetify.lang.t('$vuetify.meeting.tokenExpired'))
            } else {
              this.$notify({
                title: this.$vuetify.lang.t('$vuetify.meeting.error'),
                body: this.$vuetify.lang.t('$vuetify.meeting.scheduleMeetingFail')
              })
            }
          })
      }
    },
    init() {
      this.date = new Date().toISOString().substr(0, 10)
      this.dateFormatted = this.formatDate(new Date().toISOString().substr(0, 10))
      this.minDate = new Date().toISOString().substr(0, 10)

      let hours = new Date().getHours()
      let min = new Date().getMinutes()
      if (min > 30) {
        min = '00'
        hours = hours + 1
      } else {
        min = '30'
      }
      if (hours < 10) {
        hours = `0${hours}`
      }
      this.startTime = `${hours}:${min}`
      const dateZone = moment.utc(new Date()).tz(TIME_ZONE)
      this.timeZone = `(${TIME_ZONE}) GMT${moment(dateZone).tz(TIME_ZONE).format('Z')}`
    },
    onClose() {
      this.$emit('close')
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
#schedule-meeting {
  height: 100%;
  background-color: white;
  -webkit-app-region: drag;
  .meeting-title {
    padding: 5px 0 10px 0;
  }
  ::v-deep .v-input--selection-controls__ripple {
    color: #fff !important;
  }
  ::v-deep .mdi-square {
    color: #eeeeee;
  }
  ::v-deep #input-453 {
    width: 2px !important;
  }
  ::v-deep .v-snack__wrapper {
    min-width: 40px;
  }
  .error-text {
    color: #ea2828;
    height: 15px;
  }
  .schedule-main {
    -webkit-app-region: no-drag;
    padding: 0 16px;
    .addcalendar-remind {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
    }
    .start-content {
      ::v-deep .v-input__append-inner {
        position: absolute;
        width: 100%;
        right: -5px;
        left: 0;
        top: 0;
        bottom: 0;
      }
      ::v-deep .v-input__icon {
        position: absolute;
        right: 0;
        top: 8px;
        bottom: 0;
      }
    }
    ::v-deep .v-btn.v-btn--disabled {
      background: #cfe5fe !important;
      color: #ffffff !important;
    }
    ::v-deep .v-text-field--placeholder {
      font-size: 14px !important;
      color: #cccccc !important;
    }
    ::v-deep .v-select__selections {
      font-size: 14px;
      color: #333333;
      margin-left: 8px;
      width: 80px;
    }
    ::v-deep .v-text-field__slot {
      font-size: 14px;
    }
    ::v-deep .v-label {
      font-size: 12px !important;
      color: #333333;
    }
    .bottom-content {
      ::v-deep .v-icon {
        font-size: 18px !important;
      }
      ::v-deep .v-input__control {
        height: 25px;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .text-border-content {
    ::v-deep .v-text-field--outlined fieldset {
      border: #f8f8f8;
    }
    ::v-deep #input-313 {
      width: 0;
    }
  }
  .clockwise {
    transition: 0.3s;
    transform: rotate(180deg);
  }
}
</style>
