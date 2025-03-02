package com.ali.book.security;

import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import com.ali.book.user.UserRepository;

import lombok.RequiredArgsConstructor;

//@Service
//@RequiredArgsConstructor
public class UserDetailsServiceImpl{// implements UserDetailsService{

/*	private final UserRepository repository;
	@Override
	@Transactional
	public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return repository.findByEmail(userEmail)
				.orElseThrow(() -> new UsernameNotFoundException("User not Found"));
	}
*/
}