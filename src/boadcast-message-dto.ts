export class BoadcastMessageDto {
  target: string[] = []; //廣播要接收的目標
  timestame = new Date();
  msg = '';
  constructor() {
    // TODO:
  }
}
