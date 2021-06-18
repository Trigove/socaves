import { formatDistanceToNow } from 'date-fns';
//Our own default formatting style

export const formatMixin = {
  methods: {
    formatDate(date, inShort = false) {
      let myDate = '';
      const localeCode = this.$i18n.localeProperties.code;

      if (date) {
        myDate = formatDistanceToNow(new Date(date), { addSuffix: true });

        myDate = myDate.replace(
          'less than a minute ago',
          this.$t('time.just_now')
        );

        //Only have (s) for en
        if (!inShort && localeCode !== 'en') {
          myDate = myDate.replace('days', this.$t('time.day'));
          myDate = myDate.replace('months', this.$t('time.month'));
          myDate = myDate.replace('years', this.$t('time.year'));
          myDate = myDate.replace('minutes', this.$t('time.minute'));
          myDate = myDate.replace('hours', this.$t('time.hour'));
        }

        if (inShort && localeCode !== 'en') {
          myDate = myDate.replace('days', this.$t('time.short_day'));
          myDate = myDate.replace('months', this.$t('time.short_month'));
          myDate = myDate.replace('years', this.$t('time.short_year'));
          myDate = myDate.replace('minutes', this.$t('time.short_minute'));
          myDate = myDate.replace('hours', this.$t('time.short_hour'));
        }

        myDate = myDate.replace('minute', this.$t('time.minute'));

        myDate = myDate.replace('about', '');
        myDate = myDate.replace('almost', '');
        myDate = myDate.replace('in ', '');
        myDate = myDate.replace('ago', '');
        myDate = myDate.replace('over', this.$t('time.over'));
        myDate = myDate.replace('less than a minute', this.$t('time.just_now'));

        if (inShort) {
          myDate = myDate.replace('day', this.$t('time.short_day'));
          myDate = myDate.replace('month', this.$t('time.short_month'));
          myDate = myDate.replace('year', this.$t('time.short_year'));
          myDate = myDate.replace('minute', this.$t('time.short_minute'));
          myDate = myDate.replace('hour', this.$t('time.short_hour'));
        } else {
          myDate = myDate.replace('day', this.$t('time.day'));
          myDate = myDate.replace('month', this.$t('time.month'));
          myDate = myDate.replace('year', this.$t('time.year'));
          myDate = myDate.replace('minute', this.$t('time.minute'));
          myDate = myDate.replace('hour', this.$t('time.hour'));
        }
      }

      return myDate;
    },

    //Adding (s) to the word if the number is larger than 1
    formatPlural(word, number) {
      if (word) {
        //For english only
        if (this.$i18n.localeProperties.code === 'en') {
          return number > 1 ? `${word}s` : word;
        }
      }

      return word;
    },

    formatNumber(n) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6)
        return +(n / 1e3).toFixed(1) + this.$t('number_format.K');
      if (n >= 1e6 && n < 1e9)
        return +(n / 1e6).toFixed(1) + this.$t('number_format.M');
      if (n >= 1e9 && n < 1e12)
        return +(n / 1e9).toFixed(1) + this.$t('number_format.B');
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + this.$t('number_format.T');
    },
  },
};
