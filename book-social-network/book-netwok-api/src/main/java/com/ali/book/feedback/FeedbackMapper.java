package com.ali.book.feedback;

import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.ali.book.book.Book;

@Service
public class FeedbackMapper {

	public Feedback toFeedback(FeedbackRequest request, Authentication connectedUser) {
		// TODO Auto-generated method stub
		return Feedback.builder()
				.note(request.note())
				.comment(request.Comment())
				.book(Book.builder()
						.id(request.bookId())
						.archived(false)
						.shareable(false)
						.build())
				.build();
	}

	public FeedbackResponse toFeedbackResponse(Feedback feedback, Integer id) {
		// TODO Auto-generated method stub
		return FeedbackResponse.builder()
				.note(feedback.getNote())
				.comment(feedback.getComment())
				.ownFeedback(Objects.equals(feedback.getCreatedBy(), id))
				.build();
	}

}
