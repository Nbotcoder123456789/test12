

// Cấu hình EmailJS
emailjs.init('NzByR6ZyknP9EAPwq'); // Sử dụng User ID (Public Key) của bạn

// GitHub repository details
const githubRepo = {
    owner: 'Nbotcoder123456789',
    repo: 'test12',
    branch: 'main',
    token: GITHUB_TOKEN=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
 // Sử dụng biến môi trường
};

// Sự kiện gửi câu hỏi
document.getElementById('qa-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const questionInput = document.getElementById('question');
    const questionText = questionInput.value.trim();
    
    if (questionText) {
        // Tạo ID duy nhất cho câu hỏi
        const questionId = 'question-' + Date.now();
        
        // Tạo tệp HTML mới cho câu hỏi
        const newFileName = questionId + '.html';
        const answerFileName = 'answer-' + questionId + '.html';
        
        // Tạo nội dung HTML cho tệp câu hỏi
        const questionHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Câu hỏi</title>
</head>
<body>
    <h1>Câu hỏi:</h1>
    <p>${questionText}</p>
    <a href="${answerFileName}">Xem câu trả lời</a>
</body>
</html>
`;
        
        // Tạo nội dung HTML cho tệp câu trả lời
        const answerHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trả lời</title>
</head>
<body>
    <h1>Câu trả lời cho:</h1>
    <p>${questionText}</p>
    <p>... (câu trả lời sẽ được cập nhật tại đây)</p>
    <a href="${newFileName}">Trở lại câu hỏi</a>
</body>
</html>
`;

        // Lưu tệp HTML mới bằng cách sử dụng Blob và FileSaver.js
        saveFile(newFileName, questionHtml);
        saveFile(answerFileName, answerHtml);

        // Đẩy tệp HTML mới lên GitHub
        uploadToGitHub(newFileName, questionHtml)
            .then(() => {
                // Gửi thông báo email khi có câu hỏi mới
                emailjs.send('service_3p5uxqw', 'template_74s7brq', {
                    to_name: 'Người hỏi đã được mã hóa', // Tên người nhận
                    from_name: 'Trần Đức Nam', // Tên bạn
                    message: `Câu hỏi mới: ${questionText}`,
                    question_url: `https://raw.githubusercontent.com/${githubRepo.owner}/${githubRepo.repo}/${githubRepo.branch}/${newFileName}`
                })
                .then(function(response) {
                    console.log('Email sent successfully:', response.status, response.text);
                }, function(error) {
                    console.error('Failed to send email:', error);
                });

                // Xóa nội dung ô nhập câu hỏi
                questionInput.value = '';
            })
            .catch(error => {
                console.error('Failed to upload file to GitHub:', error);
            });
    }
});

// Hàm lưu tệp bằng Blob
function saveFile(fileName, content) {
    const blob = new Blob([content], {type: 'text/html'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

// Hàm đẩy tệp HTML lên GitHub
async function uploadToGitHub(fileName, content) {
    const url = `https://api.github.com/repos/${githubRepo.owner}/${githubRepo.repo}/contents/${fileName}`;
    const base64Content = btoa(unescape(encodeURIComponent(content))); // Mã hóa nội dung tệp thành Base64
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${githubRepo.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add ${fileName}`,
            content: base64Content,
            branch: githubRepo.branch
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to upload file to GitHub: ${response.statusText}`);
    } else {
        console.log('File uploaded to GitHub successfully');
    }
}
