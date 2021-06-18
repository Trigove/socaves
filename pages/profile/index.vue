<template>
  <div></div>
</template>

<script>
export default {
  name: 'Index',
  middleware({ $auth, redirect }) {
    if ($auth.user) {
      return redirect(`/profile/${$auth.user.username}`);
    }

    return redirect('/login');
  },
};
</script>
