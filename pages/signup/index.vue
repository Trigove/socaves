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
          v-text="$t('account.join_us')"
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
          v-text="$t('account.login_caption')"
        />

        <img
          class="pt-8 2xl:max-w-lg max-w-sm w-full place-self-center"
          :alt="$t('account.sign_up')"
          src="~/assets/img/signup.png"
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
            :alt="$t('account.sign_up')"
            class="-ml-1 w-12"
            src="~/assets/img/icon.png"
          />
        </nuxt-link>

        <!--Title for mobile only-->
        <div class="md:hidden block ml-2">
          <h1
            class="text-2xl font-extrabold text-orange-500"
            v-text="$t('account.join_us')"
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
        v-text="$t('account.sign_up')"
      />

      <!--Form-->
      <ValidationObserver ref="form" v-slot="{ invalid }">
        <form class="mt-5" @submit.prevent="submitForm">
          <!--Username input-->
          <div>
            <label
              for="username"
              class="font-medium text-sm"
              v-text="$t('account.username')"
            />
            <ValidationProvider
              v-slot="{ errors }"
              autocomplete
              :name="$t('account.username')"
              rules="required|username|onlyOnePeriodInARow|noStartWithPeriod|noEndWithPeriod|max:30"
            >
              <vs-input
                v-model="form.username"
                data-test="username"
                name="username"
                type="text"
                :placeholder="$t('account.username')"
                class="mt-2 -ml-1 normal-case"
              >
                <template v-if="errors.length > 0" #message-danger>
                  {{ errors[0] }}
                </template>
              </vs-input>
            </ValidationProvider>
          </div>

          <!--Name input-->
          <div class="mt-7">
            <label
              for="name"
              class="font-medium text-sm"
              v-text="$t('account.name')"
            />
            <ValidationProvider
              v-slot="{ errors }"
              autocomplete
              :name="$t('account.name')"
              rules="required|max:30"
            >
              <vs-input
                v-model="form.name"
                data-test="name"
                name="name"
                type="name"
                :placeholder="$t('account.name')"
                class="mt-2 -ml-1 normal-case"
              >
                <template v-if="errors.length > 0" #message-danger>
                  {{ errors[0] }}
                </template>
              </vs-input>
            </ValidationProvider>
          </div>

          <!--Email Input-->
          <div class="mt-7">
            <label
              for="email"
              class="font-medium text-sm"
              v-text="$t('account.email')"
            />
            <ValidationProvider
              v-slot="{ errors }"
              autocomplete
              :name="$t('account.email')"
              rules="required|email"
            >
              <vs-input
                v-model="form.email"
                name="email"
                type="email"
                :placeholder="$t('account.email')"
                class="mt-2 -ml-1 normal-case"
              >
                <template v-if="errors.length > 0" #message-danger>
                  {{ errors[0] }}
                </template>
              </vs-input>
            </ValidationProvider>
          </div>

          <!--Password Input-->
          <div class="mt-7">
            <label
              for="password"
              class="font-medium text-sm"
              v-text="$t('account.password')"
            />

            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('account.password')"
              rules="required|min:8|onenum|onelc|oneuc"
            >
              <vs-input
                v-model="form.password"
                autocomplete
                type="password"
                name="password"
                :visible-password="hasVisiblePassword"
                :progress="getProgress"
                :placeholder="$t('account.password')"
                class="mt-2 -ml-1 normal-case"
                icon-after
                @click-icon="hasVisiblePassword = !hasVisiblePassword"
              >
                <template #icon>
                  <iconify-icon v-if="!hasVisiblePassword" icon="visibility" />
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

          <div class="text-sm mt-5 normal-case">
            <span>
              {{ $t('signup.notice') }}
              <nuxt-link
                class="underline text-orange-500"
                :to="localePath('/terms-conditions')"
                target="_blank"
                v-text="$t('signup.terms_conditions')"
              />
              {{ $t('signup.and') }}
              <nuxt-link
                class="underline text-orange-500"
                :to="localePath('/cookie-policy')"
                target="_blank"
                v-text="$t('signup.cookie_policy')"
              />
            </span>
          </div>

          <!--Signup Button-->
          <vs-button
            data-test="SignUp-btn"
            class="h-10 bg-orange-500 m-0 font-bold rounded-full mt-8"
            color="primary"
            active
            flat
            block
            :disabled="invalid || !isFormDirty"
          >
            {{ $t('account.sign_up') }}
          </vs-button>
        </form>
      </ValidationObserver>
    </div>

    <!--Dialog showing Please verify your account-->
    <email-verify-dialog ref="dialog" :email="form.email"></email-verify-dialog>
  </div>
</template>

<script>
import rules from '@/mixins/rules';
import emailVerifyDialog from '@/components/account/emailVerifyDialog'; //Email verfiy dialog

export default {
  layout: 'account',
  components: { emailVerifyDialog },
  mixins: [rules],
  middleware: 'guest',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        username: '',
      },
      hasVisiblePassword: false,
      emailDialogActive: false,
      loading: null,
    };
  },

  computed: {
    getProgress() {
      let progress = 0;
      const val = this.form.password;

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
    this.$recaptcha.destroy();
  },

  async mounted() {
    if (process.browser) {
      if (this.$refs.form) this.$refs.form.validate({ silent: true }); //Update the form once
    }
    try {
      await this.$recaptcha.init();
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    submitForm() {
      this.register();
      this.loading = this.$vs.loading({
        color: this.$color.orange[500],
      });
    },

    async register() {
      let token;
      try {
        token = await this.$recaptcha.execute('signup');
      } catch (error) {
        console.log('Signup error:', error);
        this.loading.close();
      }
      let res;
      try {
        res = await this.$axios.post('signup', {
          username: this.form.username,
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          token,
        });
        this.loading.close();
      } catch (err) {
        this.loading.close();
        const { message, type, error } = err.response.data;
        const msgType = error.keyPattern.email ? 'email_exists' : type;
        this.$vs.notification({
          duration: 'none',
          color: this.$color.orange[500],
          position: 'bottom-right',
          title: this.$t('error'),
          text: this.$t(`auth.${msgType}`) ?? message,
        });
      }
      if (res.data.message === 'Created User') {
        // this.$router.back();
        // Show email verify dialog if sign up completed
        this.$refs.dialog.open();
      }
    },
  },

  head() {
    return {
      title: this.$t('account.sign_up'),
    };
  },
};
</script>

<style scoped>
::v-deep .vs-input__progress {
  margin-bottom: 0.5rem;
}
</style>
