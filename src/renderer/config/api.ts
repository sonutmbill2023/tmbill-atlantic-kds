import { SERVER_API_URL } from './common';

// eslint-disable-next-line import/prefer-default-export
let API_LOGIN = `${SERVER_API_URL}/tmdigi-menu/api/loginbypswd`;

export function reinitializeLinks(baseUrl: string) {
  API_LOGIN = `${baseUrl}/tmdigi-menu/api/loginbypswd`;
}
export { API_LOGIN };
