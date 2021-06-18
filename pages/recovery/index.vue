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
            uppercase
          "
          v-text="$t('account.recovery')"
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
          v-text="$t('account.recovery_caption')"
        />

        <img
          class="pt-8 2xl:max-w-lg max-w-sm w-full place-self-center"
          :alt="$t('account.sign_up')"
          src="~/assets/img/forgot_password.png"
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
            v-text="$t('account.recovery')"
          />
          <h2
            class="text-md text-md text-left font-extrabold"
            v-text="$t('account.recovery_caption')"
          />
        </div>
      </div>

      <!--Title-->
      <h5
        class="font-bold 2xl:text-2xl text-lg"
        v-text="$t('account.enter_email')"
      />

      <!--Name Input-->
      <ValidationObserver ref="form" v-slot="{ invalid }">
        <form class="mt-5" @submit.prevent="submitForm">
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
                data-test="loginac-email"
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

          <!--Signup Button-->
          <vs-button
            data-test="ResetPw-btn"
            class="h-10 bg-orange-500 m-0 font-bold rounded-full mt-8"
            color="primary"
            active
            flat
            block
            :disabled="invalid || !isFormDirty"
          >
            {{ $t('account.reset_password') }}
          </vs-button>
        </form>
      </ValidationObserver>
    </div>

    <!--Dialog showing the email sent-->
    <recovery-dialog ref="dialog" :email="form.email"></recovery-dialog>
  </div>
</template>

<script>
import rules from '@/mixins/rules';
import recoveryDialog from '@/components/account/recoveryDialog'; //Email sent dialog

export default {
  layout: 'account',
  components: { recoveryDialog },
  mixins: [rules],
  data() {
    return {
      form: {
        email: '',
      },
      recoveryDialogActive: false,
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
      this.sendForgotPwEmail();
    },

    async sendForgotPwEmail() {
      this.loading = this.$vs.loading({
        color: this.$color.orange[500],
      });

      try {
        await this.$axios.put('account/send_password_email', {
          email: this.form.email,
        });

        this.loading.close();

        this.$refs.dialog.open();
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
      // this.$router.back();
    },
  },

  head() {
    return {
      title: this.$t('account.recovery'),
    };
  },
};
</script>

<style scoped>
::v-deep .vs-input__progress {
  margin-bottom: 0.5rem;
}
</style>
