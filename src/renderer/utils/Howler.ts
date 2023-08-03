/* eslint-disable import/prefer-default-export */
import { Howl, Howler } from 'howler';

const howlsuccessnotificationSoundpath = require('../assets/notification/notification.mp3');

export function getKOTnotification() {
  return new Howl({
    src: [howlsuccessnotificationSoundpath.default],
    autoplay: false,
    loop: false,
    onloaderror: (id, error) => {
      console.error(error);
    },
    volume: 1,
  });
}
export { Howler, Howl };
