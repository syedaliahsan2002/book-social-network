package com.ali.book.auth;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ali.book.email.EmailService;
import com.ali.book.email.EmailTemplateName;
import com.ali.book.role.RoleRepository;
import com.ali.book.security.JwtService;
import com.ali.book.user.Token;
import com.ali.book.user.TokenRepository;
import com.ali.book.user.User;
import com.ali.book.user.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	
	private final PasswordEncoder passwordEncoder;

	private final RoleRepository roleRepository;
	
	private final UserRepository userRepository;
	
	private final TokenRepository tokenRepository;
	
	private final EmailService emailService;
	
	private final AuthenticationManager authenticationManager;
	
	private final JwtService jwtService;

	@Value("${spring.application.mailing.frontend.activation-url}")
	private String activationUrl;
	
	public void register(RegistrationRequest request) throws MessagingException {
		var userRole = roleRepository.findByName("USER")
				.orElseThrow(() -> new IllegalStateException("ROLE USER was not initialized"));
		var user = User.builder()
				.firstName(request.getFirstname())
				.lastName(request.getLastname())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.accountLocked(false)
				.enabled(false)
				.roles(List.of(userRole))
				.build();
			userRepository.save(user);
			sendValidationEmail(user);
	}

	private void sendValidationEmail(User user) throws MessagingException {
		// TODO Auto-generated method stub
		var newToken  = generateAndSaveActivationToken(user);
		emailService.sendEmail(user.getEmail(), user.fullName(), EmailTemplateName.ACTIVATE_ACCOUNT, activationUrl, newToken, "Account activation");
		//send email
		
	}

	private String generateAndSaveActivationToken(User user) {
		// TODO Auto-generated method stub
		String generatedToken = generateActivationCode(6);
		var token = Token.builder()
				.token(generatedToken)
				.createdAt(LocalDateTime.now())
				.expiresAt(LocalDateTime.now().plusMinutes(15))
				.user(user)
				.build();
		tokenRepository.save(token);
		return generatedToken;
	}

	private String generateActivationCode(int length) {
		// TODO Auto-generated method stub
		String characters = "0123456789";
		StringBuilder codeBuilder = new StringBuilder();
		SecureRandom secureRandom = new SecureRandom();
		for(int i = 0; i< length; i++) {
			int randomIndex = secureRandom.nextInt(characters.length());
			codeBuilder.append(characters.charAt(randomIndex));
		}
		return codeBuilder.toString();
	}

	public AuthenticationResponse authenticate(@Valid AuthenticationRequest request) {
		// TODO Auto-generated method stub
		var auth =  authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
				);
		var claims = new HashMap<String, Object>();
		var user = ((User)auth.getPrincipal());
		claims.put("fullName", user.fullName());
		var jwtToken = jwtService.generateToken(claims, user);
		return AuthenticationResponse.builder().token(jwtToken).build();
	}

	public void activateAccount(String token) throws MessagingException {
		// TODO Auto-generated method stub
		Token savedToken = tokenRepository.findByToken(token)
				.orElseThrow(() -> new RuntimeException("Invalid Token"));
		if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
			sendValidationEmail(savedToken.getUser());
			throw new RuntimeException("Activation token has expired. A new token has been sent to the same email address");
			
		}
		var user = userRepository.findById(savedToken.getUser().getId())
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		user.setEnabled(true);
		userRepository.save(user);
		savedToken.setValidatedAt(LocalDateTime.now());
		tokenRepository.save(savedToken);
	}
	public void sendPasswordResetEmail(String email) throws MessagingException {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var token = generateAndSaveResetToken(user);
        emailService.sendEmail(user.getEmail(), user.fullName(), EmailTemplateName.RESET_PASSWORD, 
                               "<your-reset-url>?token=" + token, token, "Password Reset");
    }

    private String generateAndSaveResetToken(User user) {
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);
        return generatedToken;
    }

    public void resetPassword(String token, String newPassword) {
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid Token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            throw new RuntimeException("Reset token has expired. Please request a new password reset.");
        }
        var user = savedToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }
}
