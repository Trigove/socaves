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
          v-text="$t('account.login_caption')"
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
      <h5 class="font-bold 2xl:text-2xl text-lg" v-text="$t('account.login')" />

      <!--Email or username Input-->
      <ValidationObserver ref="form" v-slot="{ invalid }">
        <form class="mt-5" @submit.prevent="submitForm">
          <div>
            <label
              for="email"
              class="font-medium text-sm"
              v-text="$t('account.email_or_username')"
            />
            <ValidationProvider
              v-slot="{ errors }"
              autocomplete
              :name="$t('account.email_or_username')"
              rules="required|emailOrUsername"
            >
              <vs-input
                v-model="form.email"
                data-test="loginac-email"
                name="email"
                type="text"
                :placeholder="$t('account.email_or_username')"
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
            <div class="flex items-center flex-wrap justify-between">
              <label
                for="password"
                class="font-medium text-sm"
                v-text="$t('account.password')"
              />
              <!--Forgot password-->
              <nuxt-link
                data-test="fgpw-btn"
                to="/recovery"
                class="text-orange-500 font-bold text-xs"
                v-text="$t('account.forgot_password')"
              />
            </div>

            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('account.password')"
              rules="required|min:8"
            >
              <vs-input
                v-model="form.password"
                data-test="loginac-pw"
                autocomplete
                type="password"
                name="password"
                :placeholder="$t('account.password')"
                class="mt-2 -ml-1 normal-case"
              >
                <template v-if="errors.length > 0" #message-danger>
                  {{ errors[0] }}
                </template>
              </vs-input>
            </ValidationProvider>

            <!--Register-->
            <div class="flex justify-center my-7 text-xs">
              <span
                class="text-gray-500 mr-1"
                v-text="$t('account.new_here')"
              />
              <nuxt-link
                data-test="createac-btn"
                to="/signup"
                class="text-orange-500 font-bold"
                v-text="$t('account.create')"
              />
            </div>
          </div>

          <!--Login Button-->
          <vs-button
            data-test="login-btn"
            class="h-10 bg-orange-500 m-0 font-bold rounded-full"
            color="primary"
            active
            flat
            block
            :disabled="invalid || !isFormDirty"
          >
            {{ $t('account.login') }}
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
        email: '',
        password: '',
      },
      loading: null,
    };
  },

  mounted() {
    if (process.browser) {
      if (this.$refs.form) this.$refs.form.validate({ silent: true }); //Update the form once
    }
  },

  beforeDestroy() {
    if (this.loading) {
      console.log(this.loading);
      this.loading.close();
    }
  },

  methods: {
    submitForm() {
      this.login();
    },
    async login() {
      this.loading = this.$vs.loading({
        color: this.$color.orange[500],
      });

      try {
        const res = await this.$auth.loginWith('cookie', {
          data: {
            email: this.form.email,
            password: this.form.password,
          },
        });
        if (res.data?.user) {
          this.$auth.setUser(res.data.user);
        }
      } catch (err) {
        this.loading.close();
        const { type } = err.response.data;

        this.$vs.notification({
          duration: 1000,
          color: this.$color.orange[500],
          position: 'bottom-right',
          text: this.$t('login_error'),
        });

        if (type === 'unverified_email') {
          // Show email verify dialog if sign up completed
          this.$refs.emailDialog.open();
        }
      }
    },
  },
  head() {
    return {
      title: this.$t('account.login'),
    };
  },
};
</script>
