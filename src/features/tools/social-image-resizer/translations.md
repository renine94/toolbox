# Social Image Resizer 번역 키

아래 내용을 `messages/ko.json`과 `messages/en.json`에 추가해주세요.

## Korean (ko.json)

### metadata.tools.socialImageResizer 추가
```json
"socialImageResizer": {
  "title": "Social Image Resizer - 디자이너 도구",
  "description": "SNS 플랫폼별 최적 이미지 크기로 한 번에 리사이즈하세요. Instagram, Facebook, Twitter, LinkedIn, YouTube, TikTok 등 12개 이상의 프리셋을 지원합니다.",
  "heading": "Social Image Resizer",
  "subheading": "SNS 플랫폼에 맞는 이미지 크기로 한 번에 변환하세요."
}
```

### tools.socialImageResizer 추가
```json
"socialImageResizer": {
  "name": "Social Image Resizer",
  "description": "SNS 플랫폼별 최적 이미지 크기로 리사이즈합니다.",
  "platforms": {
    "instagram": "Instagram",
    "facebook": "Facebook",
    "twitter": "Twitter / X",
    "linkedin": "LinkedIn",
    "youtube": "YouTube",
    "tiktok": "TikTok",
    "pinterest": "Pinterest",
    "snapchat": "Snapchat"
  },
  "presetNames": {
    "instagramPost": "포스트",
    "instagramStory": "스토리",
    "instagramReels": "릴스",
    "instagramLandscape": "가로형",
    "instagramPortrait": "세로형",
    "facebookPost": "포스트",
    "facebookCover": "커버",
    "facebookStory": "스토리",
    "facebookProfile": "프로필",
    "facebookEvent": "이벤트",
    "twitterPost": "포스트",
    "twitterHeader": "헤더",
    "twitterProfile": "프로필",
    "linkedinPost": "포스트",
    "linkedinCover": "커버",
    "linkedinProfile": "프로필",
    "linkedinCompanyCover": "회사 커버",
    "youtubeThumbnail": "썸네일",
    "youtubeBanner": "배너",
    "youtubeProfile": "프로필",
    "tiktokVideo": "비디오",
    "tiktokProfile": "프로필",
    "pinterestPin": "핀",
    "pinterestProfile": "프로필",
    "snapchatStory": "스토리"
  },
  "ui": {
    "reset": "초기화",
    "upload": {
      "title": "이미지 업로드",
      "description": "이미지를 드래그하여 놓거나 클릭하여 선택하세요",
      "formats": "WebP, PNG, JPEG, GIF, BMP 지원",
      "limits": "최대 {maxSize}MB, {maxDimension}px",
      "selectFile": "파일 선택"
    },
    "preview": {
      "title": "원본 이미지",
      "fileName": "파일명",
      "originalSize": "원본 크기",
      "fileSize": "파일 용량",
      "changeImage": "이미지 변경"
    },
    "presets": {
      "title": "플랫폼 프리셋",
      "selectedCount": "{count}개 선택됨",
      "selectAll": "전체 선택",
      "deselectAll": "전체 해제"
    },
    "download": {
      "title": "리사이즈 & 다운로드",
      "completedCount": "{count}개 완료",
      "resizeButton": "{count}개 리사이즈",
      "downloadAll": "ZIP 다운로드",
      "cancel": "취소",
      "processing": "{current}/{total} 처리 중",
      "resizing": "리사이즈 중",
      "pending": "대기 중",
      "error": "오류",
      "readyToResize": "{count}개 프리셋이 선택되었습니다. 리사이즈 버튼을 클릭하세요.",
      "selectPresetsHint": "오른쪽에서 플랫폼 프리셋을 선택하세요."
    }
  },
  "toast": {
    "uploadSuccess": "이미지가 업로드되었습니다",
    "fileTooLarge": "파일 크기가 너무 큽니다 (최대 20MB)",
    "unsupportedFormat": "지원하지 않는 파일 형식입니다",
    "dimensionTooLarge": "이미지 크기가 너무 큽니다 (최대 8192px)",
    "loadError": "이미지 로드에 실패했습니다",
    "resizeComplete": "{count}개 이미지 리사이즈 완료!",
    "downloadComplete": "다운로드가 완료되었습니다",
    "downloaded": "다운로드되었습니다"
  }
}
```

## English (en.json)

### metadata.tools.socialImageResizer 추가
```json
"socialImageResizer": {
  "title": "Social Image Resizer - Designer Tools",
  "description": "Resize images for all major social media platforms in one click. Supports 12+ presets for Instagram, Facebook, Twitter, LinkedIn, YouTube, TikTok, and more.",
  "heading": "Social Image Resizer",
  "subheading": "Resize images for all social media platforms at once."
}
```

### tools.socialImageResizer 추가
```json
"socialImageResizer": {
  "name": "Social Image Resizer",
  "description": "Resize images for all social media platforms at once.",
  "platforms": {
    "instagram": "Instagram",
    "facebook": "Facebook",
    "twitter": "Twitter / X",
    "linkedin": "LinkedIn",
    "youtube": "YouTube",
    "tiktok": "TikTok",
    "pinterest": "Pinterest",
    "snapchat": "Snapchat"
  },
  "presetNames": {
    "instagramPost": "Post",
    "instagramStory": "Story",
    "instagramReels": "Reels",
    "instagramLandscape": "Landscape",
    "instagramPortrait": "Portrait",
    "facebookPost": "Post",
    "facebookCover": "Cover",
    "facebookStory": "Story",
    "facebookProfile": "Profile",
    "facebookEvent": "Event",
    "twitterPost": "Post",
    "twitterHeader": "Header",
    "twitterProfile": "Profile",
    "linkedinPost": "Post",
    "linkedinCover": "Cover",
    "linkedinProfile": "Profile",
    "linkedinCompanyCover": "Company Cover",
    "youtubeThumbnail": "Thumbnail",
    "youtubeBanner": "Banner",
    "youtubeProfile": "Profile",
    "tiktokVideo": "Video",
    "tiktokProfile": "Profile",
    "pinterestPin": "Pin",
    "pinterestProfile": "Profile",
    "snapchatStory": "Story"
  },
  "ui": {
    "reset": "Reset",
    "upload": {
      "title": "Upload Image",
      "description": "Drag and drop an image or click to select",
      "formats": "WebP, PNG, JPEG, GIF, BMP supported",
      "limits": "Max {maxSize}MB, {maxDimension}px",
      "selectFile": "Select File"
    },
    "preview": {
      "title": "Original Image",
      "fileName": "File Name",
      "originalSize": "Original Size",
      "fileSize": "File Size",
      "changeImage": "Change Image"
    },
    "presets": {
      "title": "Platform Presets",
      "selectedCount": "{count} selected",
      "selectAll": "Select All",
      "deselectAll": "Deselect All"
    },
    "download": {
      "title": "Resize & Download",
      "completedCount": "{count} completed",
      "resizeButton": "Resize {count}",
      "downloadAll": "Download ZIP",
      "cancel": "Cancel",
      "processing": "Processing {current}/{total}",
      "resizing": "Resizing",
      "pending": "Pending",
      "error": "Error",
      "readyToResize": "{count} presets selected. Click resize button to start.",
      "selectPresetsHint": "Select platform presets on the right."
    }
  },
  "toast": {
    "uploadSuccess": "Image uploaded successfully",
    "fileTooLarge": "File size too large (Max 20MB)",
    "unsupportedFormat": "Unsupported file format",
    "dimensionTooLarge": "Image dimensions too large (Max 8192px)",
    "loadError": "Failed to load image",
    "resizeComplete": "{count} images resized successfully!",
    "downloadComplete": "Download completed",
    "downloaded": "Downloaded"
  }
}
```
