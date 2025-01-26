
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../services/services';
import { Router } from '@angular/router';
import { BookResponse, PageResponseBookResponse } from '../../../../services/models';
@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss'
})
export class MyBooksComponent implements OnInit {

  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 1;


  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAllBooks();
  }

  findAllBooks() {
    this.bookService.findAllBooksbyOwner({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (books) => {
        this.bookResponse = books;
      }
    });
  }

  goToFirstPage() {
    if (this.page > 0) {
      this.page = 0;
      this.findAllBooks();
    }
  }

  goToLastPage() {
    if (this.bookResponse.totalPages && this.page < this.bookResponse.totalPages - 1) {
      this.page = this.bookResponse.totalPages - 1;
      this.findAllBooks();
    }
  }

  goToNextPage() {
    if (!this.isLastPage) {
      this.page++;
      this.findAllBooks();
    }
  }

  goToPreviousPage() {
    if (this.page > 0) {
      this.page--;
      this.findAllBooks();
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < (this.bookResponse.totalPages || 0)) {
      this.page = page;
      this.findAllBooks();
    }
  }

  get isLastPage(): boolean {
    return this.page === (this.bookResponse.totalPages || 1) - 1;
  }

// manage books logics ->
editBook(book: BookResponse) {
  console.log('Navigating to book ID:', book.id);
  const bookId = Number(book.id); // Convert to a number if necessary
  if (!isNaN(bookId)) {
    this.router.navigate(['books', 'manage', bookId]);
  } else {
    console.error('Invalid book ID:', book.id);
  }
}

    shareBook(book: BookResponse) {
    this.bookService.updateShareableStatus({
      'book-id': book.id as number
    }).subscribe({
      next:()=>{
        book.shareable=!book.shareable;
      }
    });
    }
    archiveBook(book: BookResponse) {
  this.bookService.updateArchivedStatus({
    'book-id':book.id as number
  }).subscribe({
    next:()=>{
      book.archived=!book.archived;
    }
  })
    }
    
  
}
