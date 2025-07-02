const resetPasswordEmail = ({ user_name, reset_link }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f6fa;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: auto;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #555555;
      margin-bottom: 25px;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .footer {
      font-size: 12px;
      color: #888888;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Reset Your Password</div>
    <div class="message">
      Hello ${user_name},<br><br>
      We received a request to reset your password. Click the button below to set a new password:
    </div>
    <a href="${reset_link}" class="button">Reset Password</a>
    <div class="message" style="margin-top: 25px;">
      If you didn’t request this, you can safely ignore this email.
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} SafiPro. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  resetPasswordEmail,
};
