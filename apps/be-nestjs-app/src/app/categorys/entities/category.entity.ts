import { CategoryRes, Status } from '@pregnancy-journal-monorepo/contract';

export class Category {
  id: string;
  title: string;
  status: Status;

  constructor(category: CategoryRes) {
    this.id = category.id;
    this.title = category.title;
    this.status = category.status;
  }
}
