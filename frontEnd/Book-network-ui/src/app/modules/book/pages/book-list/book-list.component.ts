// import { Component, OnInit } from '@angular/core';
// import { BookService } from '../../../../services/services';
// import { Router } from '@angular/router';
// import { PageResponseBookResponse } from '../../../../services/models';

// @Component({
//   selector: 'app-book-list',
//   templateUrl: './book-list.component.html',
//   styleUrl: './book-list.component.scss'
// })
// export class BookListComponent implements OnInit {
// goToLastPage() {
//   this.page = this.bookResponse.totalPages as number -1;
//   this.findAllBooks();
// }
// goToNextPage() {
//   this.page ++;
//   this.findAllBooks();
// }
// goToPage(page: number) {
//   this.page = page;
//   this.findAllBooks();
// }
// goToPreviousPage() {
//   this.page--;
//   this.findAllBooks();
// }
// goToFirstPage() {
// this.page = 0;
// this.findAllBooks();
// }
//   bookResponse: PageResponseBookResponse = {};
//   page = 0;
//   size = 1;
//   constructor(
//   private bookService: BookService,
//   private router: Router
// ){}
//   ngOnInit(): void {

//     this.findAllBooks();

//   }
//   findAllBooks() {
//     this.bookService.findAllBooks({
//       page : this.page,
//       size : this.size
//     }).subscribe({
//       next: (books) =>{
//         this.bookResponse =books;
//       }
//     });
//   }




//   get isLastPage(): boolean{
//     return this.page == this.bookResponse.totalPages as number -1;
//   }
// }











// import { Component, OnInit } from '@angular/core';
// import { BookService } from '../../../../services/services';
// import { Router } from '@angular/router';
// import { BookResponse, PageResponseBookResponse } from '../../../../services/models';

// @Component({
//   selector: 'app-book-list',
//   templateUrl: './book-list.component.html',
//   styleUrls: ['./book-list.component.scss'] // fixed `styleUrls` typo
// })
// export class BookListComponent implements OnInit {
//   bookResponse: PageResponseBookResponse = {};
//   page = 0;
//   size = 1; // Adjust size as needed
//   message:string='';
//   level: string = 'succes';

//   constructor(
//     private bookService: BookService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.findAllBooks();
//   }

//   findAllBooks() {
//     this.bookService.findAllBooks({
//       page: this.page,
//       size: this.size
//     }).subscribe({
//       next: (books) => {
//         this.bookResponse = books;
//       }
//     });
//   }

//   goToFirstPage() {
//     if (this.page > 0) {
//       this.page = 0;
//       this.findAllBooks();
//     }
//   }

//   goToLastPage() {
//     if (this.bookResponse.totalPages && this.page < this.bookResponse.totalPages - 1) {
//       this.page = this.bookResponse.totalPages - 1;
//       this.findAllBooks();
//     }
//   }

//   goToNextPage() {
//     if (!this.isLastPage) {
//       this.page++;
//       this.findAllBooks();
//     }
//   }

//   goToPreviousPage() {
//     if (this.page > 0) {
//       this.page--;
//       this.findAllBooks();
//     }
//   }

//   goToPage(page: number) {
//     if (page >= 0 && page < (this.bookResponse.totalPages || 0)) {
//       this.page = page;
//       this.findAllBooks();
//     }
//   }

//   get isLastPage(): boolean {
//     return this.page === (this.bookResponse.totalPages || 1) - 1;
//   }



//   borrowBook(book:BookResponse){
//     this.message ='';
//     this.bookService.borrowBook({
//       'book-id':book.id as number
//     }).subscribe({
//       next: () =>{
//         this.level = 'sucess';
//         this.message = 'book sucessfully added to your list';
//       },
//       error: (err): void =>{
//         console.log(err);
//         this.level ='error';
//         this.message = err.error.error;
//       }
//     });
//   }
// }












import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../services/services';
import { Router } from '@angular/router';
import { BookResponse, PageResponseBookResponse } from '../../../../services/models';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 1;
  message: string = '';
  level: string = 'success';

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAllBooks();
  }

  findAllBooks() {
    this.bookService.findAllBooks({
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

  borrowBook(book: BookResponse) {
    this.message = '';
    this.bookService.borrowBook({
      'book-id': book.id as number
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Book successfully added to your list';
      },
      error: (err): void => {
        console.log(err);
        this.level = 'error';
        this.message = err.error.error;
      }
    });
  }
}
