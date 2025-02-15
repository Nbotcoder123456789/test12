// Cấu hình EmailJS
emailjs.init('NzByR6ZyknP9EAPwq');

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
        
        // Gửi thông báo email khi có câu hỏi mới
        emailjs.send('service_3p5uxqw', 'template_74s7brqservice_3p5uxqw', {
            to_name: 'Người hỏi đã được mã hóa', // Tên người nhận
            from_name: 'Trần Đức Nam', // Tên bạn
            message: `Câu hỏi mới: ${questionText}`,
            question_url: window.location.href.replace(/\/[^/]*$/, '') + '/' + newFileName
        })
        .then(function(response) {
            console.log('Email sent successfully:', response.status, response.text);
        }, function(error) {
            console.error('Failed to send email:', error);
        });
        
        // Xóa nội dung ô nhập câu hỏi
        questionInput.value = '';
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
