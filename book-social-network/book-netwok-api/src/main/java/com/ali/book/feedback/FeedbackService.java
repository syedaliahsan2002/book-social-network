package com.ali.book.feedback;

import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.ali.book.book.Book;
import com.ali.book.book.BookRepository;
import com.ali.book.common.PageResponse;
import com.ali.book.exception.OperationNotPremittedException;
import com.ali.book.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedbackService {

	private final BookRepository bookRepository;
	private final FeedbackMapper feedbackMapper;
	private final FeedbackRepositorty feedbackRepository;
	
	public Integer save(FeedbackRequest request, Authentication connectedUser) {
		
		Book book = bookRepository.findById(request.bookId())
				.orElseThrow(() -> new EntityNotFoundException("No book found with id ::" + request.bookId()));
		if(book.isArchived()|| !book.isShareable()) {
			throw new OperationNotPremittedException("you can not give a feedback, since it is archived or not shareable");
		}
		User user = ((User) connectedUser.getPrincipal());
		if(Objects.equals(book.getOwner().getId(), user.getId())) {
			throw new OperationNotPremittedException("you can not give feedback to your own book");
		}
		Feedback feedback = feedbackMapper.toFeedback(request, connectedUser);
		return feedbackRepository.save(feedback).getId();
	}

	public PageResponse<FeedbackResponse> findAllFeedbackByBook(Integer bookId, int page, int size, Authentication connectedUser) {
		// TODO Auto-generated method stub
		
		Pageable pageable = PageRequest.of(page, size);
		User user = ((User) connectedUser.getPrincipal());
		Page<Feedback> feedbacks = feedbackRepository.findAllByBookId(bookId, pageable);
		List<FeedbackResponse> feedbackResponses = feedbacks
				.stream()
				.map(f -> feedbackMapper.toFeedbackResponse(f, user.getId()))
				.toList();
		return new PageResponse<>(
				feedbackResponses,
				feedbacks.getNumber(),
				feedbacks.getSize(),
				feedbacks.getTotalElements(),
				feedbacks.getTotalPages(),
				feedbacks.isFirst(),
				feedbacks.isLast()
				);
	}
}
