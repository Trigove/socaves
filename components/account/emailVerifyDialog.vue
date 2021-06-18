<template>
  <vs-dialog
    v-model="active"
    not-close
    :prevent-close="!canClose"
    :loading="loading"
    overflow-hidden
  >
    <template #header>
      <dialog-header :hide-close="!canClose" @onClose="active = false" />
    </template>

    <div
      class="flex h-full justify-center items-center text-center flex-col pa-8"
    >
      <h1
        class="sm:text-4xl text-2xl pb-2 font-extrabold text-orange-500"
        v-text="$t('account.almost_there')"
      />

      <p
        class="font-extrabold sm:text-xl text-base"
        v-text="$t('account.verify_account')"
      />

      <img class="my-5 w-full" width="150" src="~/assets/img/email.png" />

      <!--Message-->
      <div class="mb-5">
        <p class="text-md normal-case font-bold">
          {{ $t('account.email_sent', { email }) }}
        </p>

        <p
          class="text-sm normal-case mt-1"
          v-text="$t('account.junk_mail_check')"
        />

        <p class="text-sm font-semibold normal-case mt-3">
          {{ $t('account.error_receive_email') }}
          <span role="button" class="text-orange-500 font-bold" @click="resend">
            {{ $t('account.resend_email') }}
          </span>
        </p>
      </div>

      <vs-button
        class="h-10 bg-orange-500 m-0 font-bold rounded-full max-w-xs"
        color="primary"
        active
        flat
        block
        to="/login"
        v-text="$t('account.back_to_login')"
      />
    </div>
  </vs-dialog>
</template>

<script>
/**
 * Email sent dialog used in signup page
 *  @property {string}  email The user's email
 */
export default {
  name: 'EmailVerifyDialog',
  props: {
    email: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      active: false,
      canClose: false,
      loading: false,
    };
  },
  methods: {
    async resend() {
      this.loading = true;
      try {
        await this.$axios.put('/account/send', {
          email: this.email,
        });
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.$vs.notification({
          duration: 2500,
          color: this.$color.orange[500],
          position: 'bottom-right',
          title: this.$t('error'),
          text: err.response?.data?.message ?? this.$t('error'),
        });
      }
    },
    open() {
      this.active = true;
    },
    close() {
      this.active = false;
    },
  },
};
</script>

<style scoped>
::v-deep .vs-dialog {
  margin-bottom: auto !important;
}

img {
  max-width: 100px;
}

::v-deep .vs-dialog__content {
  @apply p-8;
  margin: 0 !important;
}

::v-deep .vs-dialog--scroll .vs-dialog__content {
  max-height: initial !important;
}

@media (min-width: theme('screens.sm')) {
  img {
    max-width: 150px !important;
  }
}
</style>
