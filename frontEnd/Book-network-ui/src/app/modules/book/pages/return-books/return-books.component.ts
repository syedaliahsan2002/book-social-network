import { Component, OnInit } from '@angular/core';
import { BorrowedBookResponse, PageResponseBorrowedBookResponse } from '../../../../services/models';
import { BookService } from '../../../../services/services';

@Component({
  selector: 'app-return-books',
  templateUrl: './return-books.component.html',
  styleUrl: './return-books.component.scss'
})
export class ReturnBooksComponent implements OnInit {



  
  returnedBooks: PageResponseBorrowedBookResponse ={};
  message: string = '';
  level: string = 'success';
  page: number =0;
  size: number =5;
  // selectedBook: BorrowedBookResponse | undefined = undefined;
  constructor(
    private bookService : BookService
  
  ){}
  ngOnInit(): void {
    this.findAllReturnBooks(); //findAllBorrowedBooks()
  }
  private findAllReturnBooks() {
      this.bookService.findAllReturnedBooks({ //findAllBorrowedBooks()
        page:this.page,
        size:this.size
      }).subscribe({
        next:(res:PageResponseBorrowedBookResponse):void =>{
          this.returnedBooks =res;
        }
      })
    }
  // returnBorrowedBook(book: BorrowedBookResponse) {
  // this.selectedBook = book;
  // this.feedBackRequest.bookId = book.id as number;
  
  // }
  goToFirstPage() {
    if (this.page > 0) {
      this.page = 0;
      this.findAllReturnBooks(); //findAllBorrowedBooks()
    }
  }
  
  goToLastPage() {
    if (this.returnedBooks.totalPages && this.page < this.returnedBooks.totalPages - 1) {
      this.page = this.returnedBooks.totalPages - 1;
      this.findAllReturnBooks();//findAllBorrowedBooks()
    }
  }
  
  goToNextPage() {
    if (!this.isLastPage) {
      this.page++;
      this.findAllReturnBooks();//findAllBorrowedBooks()
    }
  }
  
  goToPreviousPage() {
    if (this.page > 0) {
      this.page--;
      this.findAllReturnBooks();//findAllBorrowedBooks()
    }
  }
  
  goToPage(page: number) {
    if (page >= 0 && page < (this.returnedBooks.totalPages || 0)) {
      this.page = page;
      this.findAllReturnBooks();//findAllBorrowedBooks()
    }
  }
  
  get isLastPage(): boolean {
    return this.page === (this.returnedBooks.totalPages || 1) - 1;
  }

  approvedBookReturn(book: BorrowedBookResponse) {
    if(!book.returned){
      this.level = 'error';
        this.message = 'the book is not yet return';
      return;
    }
    this.bookService.approvReturnBorrowedBook({
      'book-id': book.id as number
    }).subscribe({
      next:()=>{
        this.level = 'success';
        this.message = 'Book return approved';
        this.findAllReturnBooks();
      }
    });
  }
   
}
