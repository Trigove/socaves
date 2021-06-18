//Mixin validation rules for vee-validate
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

export default {
  data() {
    return {
      isFormDirty: false,
    };
  },

  //Used to fix init disable button
  watch: {
    form: {
      deep: true,
      handler() {
        //If form being edit than it is dirty used for init state of submit button
        if (!this.isFormDirty) {
          this.isFormDirty = true;
          // console.log('Dirty');
        }
      },
    },
  },

  mounted() {
    const vm = this;

    //Rules for username
    //Only period(.) and underscore(_) and alphabate and numbers is allowed
    extend('username', {
      validate(val) {
        return /^[a-zA-Z0-9_.]+$/.test(val);
      },
      message: vm.$t('rules.username'),
    });

    //Only one peroid in a row is allowed
    extend('onlyOnePeriodInARow', {
      validate(val) {
        return !/\.\./.test(val);
      },
      message: vm.$t('rules.only_one_period_in_a_row'),
    });

    //Cannot end with a period
    extend('noEndWithPeriod', {
      validate(val) {
        return val.slice(-1) !== '.';
      },
      message: vm.$t('rules.no_end_with_period'),
    });

    //Cannot end with a period
    extend('noStartWithPeriod', {
      validate(val) {
        return val.charAt(0) !== '.';
      },
      message: vm.$t('rules.no_start_with_period'),
    });

    //Rules for password
    //At least one num
    extend('onenum', {
      validate(val) {
        return /\d/.test(val);
      },
      message: vm.$t('rules.at_least_one_number'),
    });

    //At least one lowercase
    extend('onelc', {
      validate(val) {
        return /(.*[a-z].*)/.test(val);
      },
      message: vm.$t('rules.at_least_one_lowercase'),
    });

    //At least one uppercase
    extend('oneuc', {
      validate(val) {
        return /(.*[A-Z].*)/.test(val);
      },
      message: vm.$t('rules.at_least_one_uppercase'),
    });

    //At least one special character
    extend('onesc', {
      validate(val) {
        return /[^A-Za-z0-9]/.test(val);
      },
      message: vm.$t('rules.at_least_one_special_char'),
    });

    //Usage min:number
    extend('min', {
      validate(value, args) {
        //   console.log(args);

        if (Array.isArray(args)) {
          args = args[0];
        } else {
          args = args.length;
        }

        return value.length >= args;
      },
      params: ['length'],
      message: (fieldName, placeholders) => {
        //   console.log(placeholders);
        return vm.$t('rules.min', {
          field: fieldName,
          len: placeholders[0] ?? placeholders.length,
        });
      },
    });

    //Usage max:number
    extend('max', {
      validate(value, args) {
        //   console.log(args);

        if (Array.isArray(args)) {
          args = args[0];
        } else {
          args = args.length;
        }

        return value.length <= args;
      },
      params: ['length'],
      message: (fieldName, placeholders) => {
        //   console.log(placeholders);
        return vm.$t('rules.max', {
          field: fieldName,
          len: placeholders[0] ?? placeholders.length,
        });
      },
    });

    extend('email', {
      ...email,
      message: vm.$t('rules.email'),
    });

    //Email or username
    extend('emailOrUsername', {
      validate(val) {
        return !val.includes(' ');
      },
      message: vm.$t('rules.enter_valid_username_or_email'),
    });

    extend('required', {
      ...required,
      message: (fieldName) => {
        return vm.$t('rules.required', {
          field: fieldName,
        });
      },
    });
  },
};
