package com.ali.book.book;

import java.util.List;

import com.ali.book.common.BaseEntity;
import com.ali.book.feedback.Feedback;
import com.ali.book.history.BookTransactionHistory;
import com.ali.book.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class Book extends BaseEntity {

	private String title;
	
	private String authorName;
	
	private String isbn;
	
	private String synopsis;
	
	private String bookCover;
	
	private boolean archived;
	
	private boolean shareable;
	
//	@ManyToOne
//	@JoinColumn(name = "owner_id")
//	private User owner;
	
	@OneToMany(mappedBy = "book")
	private List<Feedback> feedbacks;
	
	@OneToMany(mappedBy = "book")
	private List<BookTransactionHistory> histories;
	
	@Transient
	public double getRate() {
		if(feedbacks == null || feedbacks.isEmpty()) {
			return 0.0;
		}
		var rate =this.feedbacks.stream()
				.mapToDouble(Feedback::getNote)
				.average()
				.orElse(0.0);
		double roundedRate = Math.round(rate * 10.0)/ 10.0;
		return roundedRate;
	}
	
}
