export class BoadcastMessageDto {
  target: string[] = []; //廣播要接收的目標
  // 因為 JSON 沒有 Date 型別，經過 json 轉換會變成錯誤的字串
  // 所以傳遞 Date().getTime() 原始資料最正確
  timestame = 0;
  action = BmdActionType.boadcast;
  msg = '';
}

export enum BmdActionType {
  boadcast, // 無聲廣播訊息
  ping, // ping 請求 client 回應
}

export class EchoReplyDto {
  clientId = '';
}
