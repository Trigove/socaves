<template>
  <div class="grid grid-cols-12 min-h-screen-real min-w-full capitalize">
    <!--Hero section-->
    <div class="col-span-6 bg-bg md:flex justify-center p-8 hidden">
      <div class="flex justify-center flex-col">
        <h1
          class="
            2xl:text-6xl
            lg:text-5xl
            text-4xl
            pb-5
            text-left
            font-extrabold
            text-orange-500
          "
          v-text="$t('title')"
        />

        <h2
          class="
            2xl:text-4xl
            lg:text-3xl
            md:text-2xl
            text-xl
            pb-5
            text-left
            font-extrabold
          "
          v-text="$t('account.reset_password')"
        />

        <img
          class="pt-8 2xl:max-w-lg max-w-sm w-full place-self-center"
          :alt="$t('title')"
          src="~/assets/img/signin.png"
        />
      </div>
    </div>

    <!--Form section-->
    <div
      class="
        md:col-span-6
        col-span-12
        p-8
        flex flex-col
        justify-center
        md:max-w-xl
        lg:p-20
      "
    >
      <!--Back button-->
      <div class="-mt-8">
        <vs-button
          data-test="back-btn"
          class="mr-auto -ml-3 pt-3 text-black"
          color="#000"
          icon
          transparent
          flat
          @click="$router.go(-1)"
        >
          <iconify-icon icon="back" style="font-size: 22px" />
        </vs-button>
      </div>

      <!--Form title-->
      <div class="flex flex-wrap items-center mb-2">
        <!--App logo-->
        <nuxt-link to="/">
          <img
            :alt="$t('account.login')"
            class="-ml-1 w-12"
            src="~/assets/img/icon.png"
          />
        </nuxt-link>

        <!--Title for mobile only-->
        <div class="md:hidden block ml-2">
          <h1
            class="text-2xl font-extrabold text-orange-500"
            v-text="$t('title')"
          />
          <h2
            class="text-md text-md text-left font-extrabold"
            v-text="$t('account.login_caption')"
          />
        </div>
      </div>

      <!--Title-->
      <h5
        class="font-bold 2xl:text-2xl text-lg"
        v-text="$t('account.forgot_password')"
      />

      <ValidationObserver ref="form" v-slot="{ invalid }">
        <form class="mt-5" @submit.prevent="submitForm">
          <!--Password Input-->
          <div class="mt-7">
            <!--Password Input-->
            <div class="mt-7">
              <label
                for="password"
                class="font-medium text-sm"
                v-text="$t('account.new_password')"
              />

              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('account.new_password')"
                rules="required|min:8|onenum|onelc|oneuc"
              >
                <vs-input
                  v-model="form.newPassword"
                  autocomplete
                  type="password"
                  name="password"
                  :visible-password="hasVisiblePassword"
                  :progress="getProgress"
                  :placeholder="$t('account.new_password')"
                  class="mt-2 -ml-1 normal-case"
                  icon-after
                  @click-icon="hasVisiblePassword = !hasVisiblePassword"
                >
                  <template #icon>
                    <iconify-icon
                      v-if="!hasVisiblePassword"
                      icon="visibility"
                    />
                    <iconify-icon v-else icon="visibilityOff" />
                  </template>
                  <template v-if="getProgress >= 100" #message-success>
                    {{ $t('account.secure_password') }}
                  </template>

                  <template v-if="errors.length > 0" #message-danger>
                    <span class="mt-3"> {{ errors[0] }}</span>
                  </template>
                </vs-input>
              </ValidationProvider>
            </div>

            <!--Padding-->
            <div class="flex justify-center my-7 text-xs"></div>
          </div>

          <!--Confirm Button-->
          <vs-button
            data-test="login-btn"
            class="h-10 bg-orange-500 m-0 font-bold rounded-full"
            color="primary"
            active
            flat
            block
            :disabled="invalid || !isFormDirty"
          >
            {{ $t('account.confirm') }}
          </vs-button>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import rules from '@/mixins/rules';
export default {
  layout: 'account',
  mixins: [rules],
  middleware: 'guest',
  data() {
    return {
      form: {
        newPassword: '',
      },
      email: '',
      hasVisiblePassword: false,
      loading: null,
    };
  },

  computed: {
    getProgress() {
      let progress = 0;
      const val = this.form.newPassword;

      // at least one number
      if (/\d/.test(val)) {
        progress += 25;
      }

      // at menons a lowercase
      if (/(.*[a-z].*)/.test(val)) {
        progress += 25;
      }

      // at least one upper case letter
      if (/(.*[A-Z].*)/.test(val)) {
        progress += 25;
      }

      // more than 8 digits
      if (val.length >= 8) {
        progress += 25;
      }

      // // at least one special character
      // if (/[^A-Za-z0-9]/.test(val)) {
      //   progress += 20;
      // }

      return progress;
    },
  },

  beforeDestroy() {
    if (this.loading) {
      console.log(this.loading);
      this.loading.close();
    }
  },
  created() {
    if (this.$nuxt.$route.query.id) {
      this.verify();
    } else {
      // warning
    }
  },

  mounted() {
    if (process.browser) {
      if (this.$refs.form) this.$refs.form.validate({ silent: true }); //Update the form once
    }
  },

  methods: {
    async verify() {
      let res;
      try {
        res = await this.$axios.get(
          `verify_reset?id=${this.$nuxt.$route.query.id}`
        );
      } catch (err) {
        const { message, type } = err.response.data;
        this.$vs.notification({
          duration: 'none',
          color: this.$color.orange[500],
          position: 'bottom-right',
          title: this.$t('error'),
          text: this.$t(`account.${type}`) ?? message,
        });
      }
      this.email = res.data.email;
    },
    submitForm() {
      this.forgotPassword();
    },
    async forgotPassword() {
      this.loading = this.$vs.loading({
        color: this.$color.orange[500],
      });

      let res;
      try {
        res = await this.$axios.put('account/reset_password', {
          email: this.email,
          newPassword: this.form.newPassword,
        });

        this.loading.close();
      } catch (err) {
        const { message, type } = err.response.data;
        this.$vs.notification({
          duration: 'none',
          color: this.$color.orange[500],
          position: 'bottom-right',
          title: this.$t('error'),
          text: this.$t(`account.${type}`) ?? message,
        });

        this.loading.close();
      }

      const { message, type } = res.data;

      if (message === 'Password reset') {
        this.$vs.notification({
          duration: 'none',
          color: this.$color.orange[500],
          position: 'bottom-right',
          title: this.$t('info'),
          text: this.$t(`account.${type}`) ?? message,
        });
      }
    },
  },
  head() {
    return {
      title: this.$t('account.forgot_password_title'),
    };
  },
};
</script>
