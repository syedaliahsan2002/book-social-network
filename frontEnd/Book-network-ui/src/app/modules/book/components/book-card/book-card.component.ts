import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookResponse } from '../../../../services/models';
import { input } from '@angular/core';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {




  private _book: BookResponse ={};
  private _bookCover: string | undefined;
  private _manage: boolean = false;



get book(): BookResponse{
  return this._book;
}
@Input()
set book(value: BookResponse){
  this._book= value;
}

get bookCover(): string | undefined{
  if(this._book.cover){
    return 'data:image/jpg;base64,' + this._book.cover;
  }
  return 'https://via.placeholder.com/1900x800?text=No+Cover+Available';
}

get manage(): boolean | false{
  return this._manage;
}

@Input()
set manage(value: boolean){
  this._manage =value;
}

@Output() private share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
@Output() private archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
@Output() private addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
@Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
@Output() private edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
@Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();


onShowDetails() {
    this.details.emit(this.book);
  }


onAddToWatingList() {
  this.addToWaitingList.emit(this.book);
}


onBorrow() {
  this.borrow.emit(this.book);
}


onArchive() {
  this.archive.emit(this.book);
}


onShare() {
  this.share.emit(this.book);
}


onEdit() {
  this.edit.emit(this.book);
}





}
