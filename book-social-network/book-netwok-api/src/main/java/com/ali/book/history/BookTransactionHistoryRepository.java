package com.ali.book.history;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory, Integer> {

    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.userId = :userId
            """)
    Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable, String userId);

    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.book.createdBy= :userId
            """)
    Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable, String userId);

    @Query("""
            SELECT 
            (COUNT(*) > 0) AS isBorrowed 
            FROM BookTransactionHistory bookTransactionHistory
            WHERE bookTransactionHistory.userId = :userId
            AND bookTransactionHistory.book.id = :bookId
            AND bookTransactionHistory.returnApproved = false
            """)
    boolean isAlreadyBorrowedByUser(Integer bookId, String userId);

    @Query("""
            SELECT transaction
            FROM BookTransactionHistory transaction
            WHERE transaction.userId = :userId
            AND transaction.book.id = :bookId
            AND transaction.returned = false
            AND transaction.returnApproved = false
            """)
    Optional<BookTransactionHistory> findByBookIdAndUserId(Integer bookId, String userId);

    @Query("""
            SELECT transaction
            FROM BookTransactionHistory transaction
            WHERE transaction.book.createdBy = :userId
            AND transaction.book.id = :bookId
            AND transaction.returned = true
            AND transaction.returnApproved = false
            """)
    Optional<BookTransactionHistory> findByBookIdAndOwnerId(Integer bookId, String userId);
}
