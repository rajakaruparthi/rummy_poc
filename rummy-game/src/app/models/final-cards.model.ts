

// "roomId": "", "cards" : ary[1], "foldedFlag" : users[index].folded, "playerName": users[index].name}
export class FinalCardsModel {
  constructor(
    public cards: string[],
    public foldedFlag: boolean,
    public playerName: string,
  ) {}
}
