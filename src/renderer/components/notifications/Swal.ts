import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const rawSwalInstance = withReactContent(Swal);
export const SwalInstance = rawSwalInstance.mixin({
  width: 450,
  customClass: {
    popup: 'tmbill-swal-pop-up',
    title: 'tmbill-swal-title-class',
    confirmButton: 'tmbill-swal-confirm-button-class',
  },
});

export function showSwalmessage(message: string) {
  if (SwalInstance.isVisible()) SwalInstance.showValidationMessage(message);

  setTimeout(() => {
    if (SwalInstance.isVisible()) SwalInstance.resetValidationMessage();
  }, 2000);
}
