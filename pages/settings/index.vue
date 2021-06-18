<template>
  <div class="flex justify-center w-full md:p-8">
    <vs-dialog v-if="$auth.loggedIn" v-model="activeDelAcc" width="350px">
      <template #header>
        <dialog-header @onClose="activeDelAcc = false">
          {{ $t('account.delete') }}
        </dialog-header>
      </template>

      <p class="text-sm">
        {{ $t('account.del_warn') }}
      </p>

      <div class="overflow-hidden mt-3">
        <vs-input
          v-model="deleteConfirmInput"
          class="text-sm"
          :placeholder="
            $t('account.del_msg', { username: $auth.user.username })
          "
        />
      </div>

      <template #footer>
        <div class="flex">
          <vs-button
            class="ml-auto font-medium text-sm text-gray-500"
            transparent
            dark
            @click="activeDelAcc = false"
          >
            {{ $t('post.cancel') }}
          </vs-button>

          <vs-button
            class="font-medium text-sm"
            transparent
            danger
            @click="delAccount"
          >
            {{ $t('post.delete') }}
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <!--File picker for avatar-->
    <input
      ref="fileInput"
      class="hidden"
      type="file"
      :accept="acceptFileTypes"
      name="img"
      @click="resetImageUploader"
      @change="onPick"
    />

    <!--Image editor using croppie-->
    <image-editor
      ref="imageEditor"
      :stencil-props="{ maxAspectRatio: 1, minAspectRatio: 1 }"
      @onConfirm="onEditorConfirm"
    />

    <ValidationObserver
      v-slot="{ invalid }"
      ref="form"
      class="
        bg-white
        md:rounded-2xl md:shadow-base
        p-10
        w-full
        md:max-w-2xl
        w-full
      "
      tag="div"
    >
      <form class="flex flex-col h-full" @submit.prevent="">
        <!-- background -->
        <div class="flex sm:flex-row flex-col">
          <!--Settings panel-->
          <div class="flex flex-col sm:order-1 order-2">
            <h1
              class="text-orange-500 font-bold text-5xl w-full sm:block hidden"
            >
              {{ $t('settings') }}
            </h1>

            <template v-if="$auth.loggedIn">
              <p class="mt-5 font-medium text-base">{{ $t('name') }}</p>

              <ValidationProvider
                v-slot="{ errors }"
                autocomplete
                :name="$t('account.name')"
                rules="max:30"
              >
                <vs-input
                  v-model="name"
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

              <p class="mt-5 font-medium text-base">{{ $t('username') }}</p>

              <ValidationProvider
                v-slot="{ errors }"
                autocomplete
                :name="$t('account.username')"
                rules="required|username|onlyOnePeriodInARow|noStartWithPeriod|noEndWithPeriod|max:30"
              >
                <vs-input
                  v-model="username"
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
            </template>

            <p class="mt-5 font-medium text-base">{{ $t('lang') }}</p>

            <vs-select
              v-model="selectedLocale"
              class="mt-1.5 max-w-none"
              @click="$forceUpdate()"
              @change="onChangeLang(selectedLocale)"
            >
              <vs-option label="English" value="en" data-test="en">
                English
              </vs-option>
              <vs-option label="繁體中文" value="zh" data-test="zh">
                繁體中文
              </vs-option>
            </vs-select>
          </div>

          <div class="sm:ml-auto sm:order-2 order-1">
            <h1
              class="text-orange-500 font-bold text-4xl w-full sm:hidden block"
            >
              {{ $t('settings') }}
            </h1>

            <template v-if="$auth.loggedIn">
              <p class="mt-5 font-medium text-base text-left">
                {{ $t('profile_pic') }}
              </p>

              <div class="flex items-center flex-col">
                <avatar
                  no-click
                  class="mt-3 text-5xl"
                  size="150"
                  :user="user"
                  circle
                  @click.native="openFileUploader"
                ></avatar>

                <vs-button
                  transparent
                  role="button"
                  class="mt-1 text-black"
                  @click="openFileUploader"
                >
                  {{ $t('profile_pic_change') }}
                </vs-button>
              </div>
            </template>
          </div>
        </div>

        <div
          v-if="$auth.loggedIn"
          class="mt-auto flex items-center justify-center pt-3"
        >
          <!-- del ac -->
          <vs-button
            class="text-sm font-medium btn-p-0 mr-auto"
            data-test="delete-acc-btn"
            danger
            transparent
            @click="activeDelAcc = true"
          >
            <div class="mr-2">
              <iconify-icon
                icon="trash"
                style="width: 1.2em"
                class="text-red-500 text-base"
              />
            </div>

            <span clas="pr-1.5">
              {{ $t('account.delete') }}
            </span>
          </vs-button>

          <!--Save settings -->
          <vs-button
            flat
            class="text-sm font-medium ml-auto bg-orange-500 text-white"
            :disabled="isSaving || invalid || !isChanged"
            @click="save"
          >
            {{ $t('account.save') }}
          </vs-button>
        </div>
      </form>
    </ValidationObserver>
    <!--Widget sections-->
    <!--class="sticky"
        style="top: 75px"-->
    <div class="xl:ml-20 ml-12 lg:block hidden">
      <widget></widget>
    </div>

    <!-- <div>{{ posts }}</div> -->
  </div>
</template>

<script>
import widget from '@/components/widget/index';
import imageEditor from '@/components/postCreatorDialog/imageEditor';
import { nanoid } from 'nanoid';
import rules from '@/mixins/rules';

export default {
  name: 'Settings',
  components: { widget, imageEditor },
  mixins: [rules],
  data() {
    return {
      user: this.$auth?.user,
      activeDelAcc: false, //Dialog
      value: 1,
      newAvatarBase64: null,
      isSaving: false, //Is updating user profile
      selectedLocale: this.$i18n.locale,
      name: this.$auth.loggedIn ? this.$auth.user.personalInfo.name : '',
      username: this.$auth.loggedIn ? this.$auth.user.username : '',
      deleteConfirmInput: '',
      acceptFileTypes: 'image/x-png,image/jpeg', //Avaatr picker
    };
  },

  computed: {
    isChanged() {
      return (
        this.name !== this.$auth?.user?.personalInfo?.name ||
        this.username !== this.$auth?.user?.username ||
        this.newAvatarBase64 !== null
      );
    },
  },

  mounted() {
    this.$refs.form?.validate({ silent: true }); //Update the form once
  },

  methods: {
    onChangeLang(selected) {
      this.$i18n.setLocaleCookie(selected);
      this.switchLocalePath(selected);
      this.$router.go('blank');
    },

    //Fix for not triggering see: https://stackoverflow.com/questions/54124977/vuejs-input-file-selection-event-not-firing-upon-selecting-the-same-file
    resetImageUploader() {
      this.$refs.fileInput.value = '';
    },

    //Trigger after file being picked
    onPick(evt) {
      console.log('onPick', evt.target.files);
      //Pass the picked files to the parent (Dialog)
      this.files = [...evt.target.files];
      console.log(this.files, this.files[0]);

      const editImage = {
        id: nanoid(),
        file: this.files[0],
      };

      //Open editor
      this.$refs.imageEditor.open(editImage);

      //this.active = true; //Open the dialog
      // this.editImage.id = id;
      // this.editImage.src = file.src ?? URL.createObjectURL(file);
      // this.editImage.type = file.type;
      // this.editImage.name = file.fileName ?? file.name;
      // console.log(this.editImage.type);
    },

    getBase64(file, width = 512, height = 512) {
      return new Promise((resolve, reject) => {
        // create an off-screen canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = URL.createObjectURL(file);
        console.log(img.src);

        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;

        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          console.log(canvas);
          return resolve(canvas.toDataURL(file.type));
        };

        img.onerror = (e) => {
          return reject(e);
        };
      });
    },

    openFileUploader() {
      this.$refs.fileInput?.click();
    },

    // getBase64(file) {
    //   return new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => resolve(reader.result);
    //     reader.onerror = (error) => reject(error);
    //   });
    // },

    //Handel when file being edit
    async onEditorConfirm(item) {
      const b64Avatar = await this.getBase64(item.file);
      this.newAvatarBase64 = b64Avatar;
      this.user = {
        ...this.user,
        avatar: this.newAvatarBase64,
      };
    },

    async save() {
      try {
        this.isSaving = true;

        const newInfo = {
          username: this.username,
          name: this.name,
        };

        if (this.newAvatarBase64) {
          newInfo.avatar = this.newAvatarBase64;
        }

        await this.$axios.put('/utils/users/info', newInfo);

        this.isSaving = false;

        const user = { ...this.$auth.user };

        user.username = newInfo.username;
        user.personalInfo.name = newInfo.name;

        if (newInfo.avatar) {
          user.avatar = newInfo.avatar;
        }

        this.$auth.setUser(user);

        console.log(this.$auth.user);

        this.user = {
          ...this.user,
          avatar: this.newAvatarBase64,
        };

        //Prevnet user save again
        this.newAvatarBase64 = null;

        this.$vs.notification({
          duration: 1500,
          color: this.$color.orange[500],
          position: 'bottom-right',
          text: this.$t('settings_saved'),
        });
      } catch (e) {
        this.isSaving = false;
        console.log(e);
        this.$vs.notification({
          duration: 1500,
          color: this.$color.orange[500],
          position: 'bottom-right',
          text: this.$t('error'), //error
        });
      }
    },

    async delAccount() {
      if (this.deleteConfirmInput === this.$auth.user.username) {
        try {
          await this.$axios.delete('/users');
        } catch (err) {
          console.log(err);
        }

        this.$vs.notification({
          duration: 1500,
          color: this.$color.orange[500],
          position: 'bottom-right',
          text: this.$t('account.deleted_msg'),
        });

        await this.$auth.logout();
        this.$router.app.refresh();
        return;
      }

      this.$vs.notification({
        duration: 1500,
        color: this.$color.orange[500],
        position: 'bottom-right',
        text: this.$t('account.del_msg', {
          username: this.$auth.user.username,
        }),
      });
    },
  },

  head() {
    return {
      title: this.$t('settings'),
    };
  },
};
</script>
