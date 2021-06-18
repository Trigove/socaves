import { EPost } from '@/server/types/post';

export const state = () => ({
  active: false, //Trigger the create post dialog
  type: EPost.POST, //Type of post
  files: [], //File picker array
  isEditMode: false, //Is it edit mode?
  repostObj: null, //For repost only (Accept a post object) + special field: parentPrivacy
  editObj: null, //For edit only (Accept a post object)
  acceptFileTypes:
    'image/x-png,image/gif,image/jpeg,video/mp4,video/x-m4v,video/x-matroska,.mkv',
});

export const mutations = {
  //Files is the files array that from the file picker
  open(state, { files = [] }) {
    console.log(files);
    state.active = true;
    state.isEditMode = false;
    state.type = EPost.POST ?? 'POST';
    state.files = files;
  },

  addFiles(state, { files = [] }) {
    state.files = [...files, ...state.files];
  },

  openShare(state, repostObj) {
    console.log(repostObj);
    state.active = true;
    state.isEditMode = false;
    state.type = EPost.SHARE ?? 'SHARE';
    state.repostObj = repostObj; //post object + special field: parentPrivacy
  },

  openEdit(state, editObj) {
    state.active = true;
    state.type = EPost.POST;
    state.isEditMode = true;
    state.files = editObj.media ?? [];
    state.editObj = editObj;
  },

  close(state) {
    state.active = false;
    //Garbage Collection
    state.repostObj = null;
    state.editObj = null;
    state.files = [];
  },
};

export const actions = {
  open(context) {
    context.commit('open', { files: [] });
  },
  close(context) {
    context.commit('close');
  },
};
