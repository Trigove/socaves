<template>
  <div>
    Own cam
    <video id="v1"></video>
    Others cam
    <video id="v2"></video>
    <form>
      <textarea id="incoming"></textarea>
      <button type="submit">{{ $t(video.submit) }}</button>
    </form>
    <vs-button class="text-xl" @click="onClick">
      {{ $t('video.test') }}
    </vs-button>
    <pre id="outgoing"></pre>
  </div>
</template>

<script>
import Peer from 'simple-peer';
export default {
  data() {
    return {
      socket: null,
      p: null,
    };
  },

  mounted() {
    // this.p = new Peer({
    //   initiator: location.hash === '#1',
    //   trickle: false,
    // });
    // this.p.on('error', (err) => console.log('error', err));
    // this.p.on('signal', (data) => {
    //   console.log('SIGNAL', JSON.stringify(data));
    //   document.querySelector('#outgoing').textContent = JSON.stringify(data);
    // });
    // document.querySelector('form').addEventListener('submit', (ev) => {
    //   ev.preventDefault();
    //   this.p.signal(JSON.parse(document.querySelector('#incoming').value));
    // });
    // this.p.on('connect', () => {
    //   console.log('CONNECT');
    //   this.p.send('whatever' + Math.random());
    // });
    // this.p.on('stream', (stream) => {
    //   console.log('p1 stream');
    //   // got remote video stream, now let's show it in a video tag
    //   const video = document.querySelector('#v2');
    //   if ('srcObject' in video) {
    //     video.srcObject = stream;
    //   } else {
    //     video.src = window.URL.createObjectURL(stream); // for older browsers
    //   }
    //   video.play();
    // });
    // this.p.on('data', (data) => {
    //   console.log('data: ' + data);
    // });
  },
  methods: {
    async onClick() {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        this.addMedia(stream);
      } catch (err) {
        console.log(err);
      }
    },
    addMedia(stream) {
      this.p = new Peer({
        initiator: location.hash === '#1',
        trickle: false,
        stream,
      });
      this.p.on('error', (err) => console.log('error', err));

      this.p.on('signal', (data) => {
        console.log('SIGNAL', JSON.stringify(data));
        document.querySelector('#outgoing').textContent = JSON.stringify(data);
      });

      document.querySelector('form').addEventListener('submit', (ev) => {
        ev.preventDefault();
        this.p.signal(JSON.parse(document.querySelector('#incoming').value));
      });

      this.p.on('connect', () => {
        console.log('CONNECT');
        this.p.send('whatever' + Math.random());
      });

      this.p.on('stream', (stream) => {
        console.log('p1 stream');
        // got remote video stream, now let's show it in a video tag
        const video = document.querySelector('#v2');

        if ('srcObject' in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream); // for older browsers
        }

        video.play();
      });
      this.p.on('data', (data) => {
        console.log('data: ' + data);
      });
      console.log(stream);
      // this.p.addStream(stream); // <- add streams to peer dynamically
      console.log('pmain stream');
      // got remote video stream, now let's show it in a video tag
      const video = document.querySelector('#v1');

      if ('srcObject' in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream); // for older browsers
      }

      video.play();
    },
  },
};
</script>

<style lang="scss" scoped>
#outgoing {
  width: 600px;
  word-wrap: break-word;
  white-space: normal;
}
</style>
