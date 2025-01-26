import { Component, OnInit } from '@angular/core';
import { BorrowedBookResponse, FeedbackRequest, PageResponseBorrowedBookResponse } from '../../../../services/models';
import { BookService, FeedbackService } from '../../../../services/services';

@Component({
  selector: 'app-borrowed-book-list',
  templateUrl: './borrowed-book-list.component.html',
  styleUrl: './borrowed-book-list.component.scss'
})
export class BorrowedBookListComponent implements OnInit {


returnBook(withFeedback: boolean) {
this.bookService.returnBorrowedBook({
  'book-id': this.selectedBook?.id as number
}).subscribe({
  next:()=>{
    if(withFeedback){
      this.giveFeedback();
    }
    this.selectedBook = undefined;
    this.findAllBorrowedBooks();
  }
})
}
 private giveFeedback() {
    this.feedbackService.saveFeedback({
      body:this.feedBackRequest
    }).subscribe({
      next:()=>{}
    })
  }

borrowedBooks: PageResponseBorrowedBookResponse ={};
feedBackRequest:FeedbackRequest={
  Comment: '',
  bookId: 0,
  note:0
};
page: number =0;
size: number =5;
selectedBook: BorrowedBookResponse | undefined = undefined;
constructor(
  private bookService : BookService,
  private feedbackService :FeedbackService

){}
ngOnInit(): void {
  this.findAllBorrowedBooks();
}
private findAllBorrowedBooks() {
    this.bookService.findAllBorrowedBooks({
      page:this.page,
      size:this.size
    }).subscribe({
      next:(res:PageResponseBorrowedBookResponse):void =>{
        this.borrowedBooks =res;
      }
    })
  }
returnBorrowedBook(book: BorrowedBookResponse) {
this.selectedBook = book;
this.feedBackRequest.bookId = book.id as number;

}
goToFirstPage() {
  if (this.page > 0) {
    this.page = 0;
    this.findAllBorrowedBooks();
  }
}

goToLastPage() {
  if (this.borrowedBooks.totalPages && this.page < this.borrowedBooks.totalPages - 1) {
    this.page = this.borrowedBooks.totalPages - 1;
    this.findAllBorrowedBooks();
  }
}

goToNextPage() {
  if (!this.isLastPage) {
    this.page++;
    this.findAllBorrowedBooks();
  }
}

goToPreviousPage() {
  if (this.page > 0) {
    this.page--;
    this.findAllBorrowedBooks();
  }
}

goToPage(page: number) {
  if (page >= 0 && page < (this.borrowedBooks.totalPages || 0)) {
    this.page = page;
    this.findAllBorrowedBooks();
  }
}

get isLastPage(): boolean {
  return this.page === (this.borrowedBooks.totalPages || 1) - 1;
}

}
