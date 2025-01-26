package com.ali.book.file;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageService {
	
	@Value("${spring.application.file.upload.photos-output-path}")
	private String fileUploadPath;
	
	public String saveFile(
		@Nonnull MultipartFile sourceFile,
		@Nonnull Integer userId) {
		// TODO Auto-generated method stub
		final String fileUploadSubPath = "users" + File.separator + userId; 
		return uploadFile(sourceFile, fileUploadSubPath);
	}

	private String uploadFile(
		@Nonnull MultipartFile sourceFile, 
		@Nonnull String fileUploadSubPath) {
		// TODO Auto-generated method stub
		final String finalUploadPath = fileUploadPath + File.separator + fileUploadSubPath;
		File targetFolder = new File(finalUploadPath);
		if(!targetFolder.exists()) {
			boolean folderCreated = targetFolder.mkdirs();
			if(!folderCreated) {
				log.warn("failed to create the target folder");
				return null;
			}
		}
		
		final String fileExtension = getFileExtension(sourceFile.getOriginalFilename());
		
		String targetFilePath = finalUploadPath + File.separator + System.currentTimeMillis() + "." + fileExtension ;
		Path targetPath = Paths.get(targetFilePath);
		try {
			Files.write(targetPath, sourceFile.getBytes());
			log.info("file save to :" + targetFilePath);
			return targetFilePath;
		} catch (IOException e) {
			// TODO: handle exception
			log.error("file was not saved", e);
		}
		return null;
	}

	private String getFileExtension(String filename) {
		// TODO Auto-generated method stub
		if(filename == null || filename.isEmpty()) {
			return "";
		}
		//something.jpg
		int lastDotIndex = filename.lastIndexOf(".");
		if(lastDotIndex == -1) {
			return "";
		}
		return filename.substring(lastDotIndex + 1).toLowerCase();
	}

}
