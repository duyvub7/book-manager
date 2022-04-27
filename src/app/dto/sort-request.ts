export class SortRequest {
  
  columnName!: string;
  sortDesc!: boolean;

  constructor(columName: string, sortDesc: boolean) {
    this.columnName = columName
    this.sortDesc = sortDesc
  }

}